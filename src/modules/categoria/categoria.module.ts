import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaRepository } from './categoria.repository';

@Module({
  providers: [CategoriaRepository, CategoriaService],
  exports: [CategoriaService],
})
export class CategoriaModule {}
