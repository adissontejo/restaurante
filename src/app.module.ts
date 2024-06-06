import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { RestauranteModule } from './modules/restaurante/restaurante.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AppExceptionFilter } from './core/exception.core';
import { StorageModule } from './storage/storage.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    StorageModule,
    RestauranteModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule {}
