import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthControler {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body('code') code?: string) {
    return this.authService.login(code);
  }

  @Post('/refresh')
  async refresh(@Body('refreshToken') refreshToken?: string) {
    return this.authService.refresh(refreshToken);
  }
}
