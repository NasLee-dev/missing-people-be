import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() credentials: { email: string; password: string }) {
    console.log(credentials);
    return this.authService.signInAndSetSession(
      credentials.email,
      credentials.password,
    );
  }
}
