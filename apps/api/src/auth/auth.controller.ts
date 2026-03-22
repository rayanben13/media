// src/auth/auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express'; // ✅ أضف type
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.gaurd';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ✅ Step 1: Redirect to Google
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // Guard redirects to Google automatically
  }

  // ✅ Step 2: Google redirects back here
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: any, @Res() res: Response) {
    try {
      const result = await this.authService.googleLogin(req.user);

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      // ✅ Set token in HTTP-only cookie
      res.cookie('google-auth-token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 1000, // 1 minute (temporary, just for the redirect)
        path: '/',
      });

      // ✅ Set user data in HTTP-only cookie
      res.cookie('google-auth-user', JSON.stringify(result.user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 1000, // 1 minute
        path: '/',
      });

      // ✅ Redirect with NO sensitive data in URL
      res.redirect(`${frontendUrl}/auth/google/callback`);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/login?error=google_auth_failed`);
    }
  }
}
