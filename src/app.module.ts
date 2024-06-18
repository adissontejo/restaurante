import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { RestauranteModule } from './modules/restaurante/restaurante.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { FuncionarioModule } from './modules/funcionario/funcionario.module';
import { CupomModule } from './modules/cupom/cupom.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AppExceptionFilter } from './core/exception.core';
import { StorageModule } from './storage/storage.module';
import { ContaModule } from './modules/conta/conta.module';
import { ItemModule } from './modules/item/item.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    StorageModule,
    RestauranteModule,
    UsuarioModule,
    FuncionarioModule,
    CupomModule,
    ContaModule,
    ItemModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule {}
