import { Global, Module } from '@nestjs/common';
import { AuthControler } from './auth.controller';
import { OAuth2ClientProvider } from './providers/oauth2-client.provider';

@Global()
@Module({
  controllers: [AuthControler],
  providers: [OAuth2ClientProvider],
  exports: [OAuth2ClientProvider],
})
export class AuthModule {}
