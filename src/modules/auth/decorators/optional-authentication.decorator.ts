import { Reflector } from '@nestjs/core';

export const OptionalAuthentication = Reflector.createDecorator<boolean>();
