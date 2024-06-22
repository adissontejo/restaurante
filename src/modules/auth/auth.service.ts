import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OAuth2Client } from 'google-auth-library';
import { AppException, ExceptionType } from 'src/core/exception.core';
import { getUserProfile } from 'src/services/google';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly reflector: Reflector,
    private readonly authClient: OAuth2Client,
    private readonly usuarioService: UsuarioService,
  ) {}

  async login(code?: string) {
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

  async verifyToken(token: string | undefined, optional: boolean = false) {
    token = token?.split(' ')[1];

    if (!token && !optional) {
      throw new AppException('Missing credentials', ExceptionType.UNAUTHORIZED);
    } else if (!token) {
      return;
    }

    try {
      const profile = await getUserProfile(token);

      return profile;
    } catch (err) {
      throw new AppException('Invalid credentials', ExceptionType.UNAUTHORIZED);
    }
  }
}
