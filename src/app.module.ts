import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { RestauranteModule } from './modules/restaurante/restaurante.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DatabaseModule, RestauranteModule, ConfigModule.forRoot()],
})
export class AppModule {}
