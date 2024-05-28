import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Database } from './database.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [Database],
  exports: [Database],
})
export class DatabaseModule {}
