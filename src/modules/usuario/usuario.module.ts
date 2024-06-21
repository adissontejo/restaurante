import { Global, Module } from '@nestjs/common';
import { UsuarioRepository } from './usuario.repository';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';

@Global()
@Module({
  providers: [UsuarioRepository, UsuarioService],
  exports: [UsuarioService],
  controllers: [UsuarioController],
})
export class UsuarioModule {}
