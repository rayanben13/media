import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider } from '@prisma/client';
import * as argon2 from 'argon2';
import { verify } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginInput } from './dto/login-input';
import { SignupInput } from './dto/signup-input';
import { authPayload } from './types/auth-payload';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new NotFoundException('Invalid credentials');

    if (!user.password) {
      throw new UnauthorizedException(
        'This account uses Google Sign-In. Please login with Google.',
      );
    }

    const passwordMatched = await verify(user.password, password);

    if (!passwordMatched) throw new NotFoundException('Invalid credentials');

    return user;
  }

  async generateToken(userId: number) {
    const payload: authPayload = {
      sub: userId,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async login(input: LoginInput) {
    const user = await this.validateUser(input);
    const { accessToken } = await this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        provider: user.provider,
      },
      accessToken,
    };
  }

  async signUp(input: SignupInput) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 2. Hash password with Argon2
    const hashedPassword = await argon2.hash(input.password);

    // 3. Create user
    const user = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
        provider: AuthProvider.LOCAL,
      },
    });

    // 4. Generate JWT token
    const accessToken = this.generateToken(user.id);

    // 5. Return token + user
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        provider: user.provider,
      },
      accessToken,
    };
  }

  // ✅ Google Login/SignUp
  async googleLogin(googleUser: {
    providerId: string;
    email: string;
    name: string;
    avatar: string | null;
  }) {
    let user = await this.prisma.user.findFirst({
      where: {
        provider: AuthProvider.GOOGLE,
        providerId: googleUser.providerId,
      },
    });

    if (!user) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: googleUser.email },
      });

      if (existingUser) {
        user = await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            provider: AuthProvider.GOOGLE,
            providerId: googleUser.providerId,
            avatar: googleUser.avatar || existingUser.avatar,
          },
        });
      } else {
        user = await this.prisma.user.create({
          data: {
            email: googleUser.email,
            name: googleUser.name,
            avatar: googleUser.avatar,
            provider: AuthProvider.GOOGLE,
            providerId: googleUser.providerId,
          },
        });
      }
    }

    // ✅ Generate JWT
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }
}
