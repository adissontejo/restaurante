import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaRepository } from './categoria.repository';
import { CategoriaController } from './categoria.controller';
import { RestauranteModule } from '../restaurante/restaurante.module';

@Module({
  imports: [RestauranteModule],
  controllers: [CategoriaController],
  providers: [CategoriaRepository, CategoriaService],
  exports: [CategoriaService],
})
export class CategoriaModule {}
