import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login-input';
import { SignupInput } from './dto/signup-input';
import { AuthResponse } from './entity/auth-response.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'login' })
  async login(@Args('loginInput') input: LoginInput) {
    return await this.authService.login(input);
  }

  @Mutation(() => AuthResponse)
  signUp(@Args('input') input: SignupInput) {
    return this.authService.signUp(input);
  }
}
