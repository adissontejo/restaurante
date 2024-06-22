import { Global, Module } from '@nestjs/common';
import { AuthControler } from './auth.controller';
import { OAuth2ClientProvider } from './providers/oauth2-client.provider';
import { AuthService } from './auth.service';

@Global()
@Module({
  controllers: [AuthControler],
  providers: [AuthService, OAuth2ClientProvider],
  exports: [AuthService, OAuth2ClientProvider],
})
export class AuthModule {}
