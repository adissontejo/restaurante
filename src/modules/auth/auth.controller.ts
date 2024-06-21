import { Body, Controller, Inject, Post, forwardRef } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { UsuarioService } from '../usuario/usuario.service';
import { getUserProfile } from 'src/services/google';

@Controller('/auth')
export class AuthControler {
  @Inject(forwardRef(() => UsuarioService))
  private readonly usuarioService: UsuarioService;

  constructor(private readonly authClient: OAuth2Client) {}

  @Post('/login')
  async login(@Body('code') code: string) {
    if (typeof code !== 'string') {
      throw new AppException('Missing code', ExceptionType.INVALID_PARAMS);
    }

    try {
      const { tokens } = await this.authClient.getToken(code);
      const profile = await getUserProfile(tokens.access_token || '');
      await this.usuarioService.createIfNotExists({
        nome: profile.name,
        email: profile.email,
        fotoPerfilUrl: profile.picture,
        celular: '',
        dataNascimento: '1990-02-02',
      });

      return { accessToken: tokens.access_token };
    } catch (err) {
      throw new AppException('Invalid code', ExceptionType.UNAUTHORIZED);
    }
  }
}
