import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { OptionalAuthentication } from './optional-authentication.decorator';
import { AuthInterceptor } from '../interceptors/auth.interceptor';

export const UseAuthentication = ({
  optional = false,
}: { optional?: boolean } = {}) => {
  return applyDecorators(
    OptionalAuthentication(optional),
    UseInterceptors(AuthInterceptor),
  );
};
