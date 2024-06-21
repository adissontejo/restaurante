import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

export const OAuth2ClientProvider: Provider = {
  provide: OAuth2Client,
  useFactory: (configService: ConfigService) => {
    return new OAuth2Client(
      configService.get('GOOGLE_CLIENT_ID'),
      configService.get('GOOGLE_CLIENT_SECRET'),
      'postmessage',
    );
  },
  inject: [ConfigService],
};
