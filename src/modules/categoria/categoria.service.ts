import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/decorators/transaction.decorator';
import { compareTimes } from 'src/utils/time';
import { CategoriaRepository } from './categoria.repository';
import { CreateCategoriaDTO } from './dtos/create-categoria.dto';
import { Categoria } from './categoria.entity';
import { CategoriaMapper } from './mapper/categoria.mapper';

@Injectable()
export class CategoriaService {
  constructor(private readonly repository: CategoriaRepository) {}

  @Transaction()
  async unsafeCategoriasForItem(
    item_id: number,
    data: CreateCategoriaDTO[],
  ) {
    await this.deleteById(item_id);

    const categorias = data.map((item) =>
      CategoriaMapper.fromCreateDTOToEntity(item),
    );

    await this.repository.insertMany(categorias as Categoria[]);

    return categorias;
  }

  async deleteById(item_id: number) {
    await this.repository.deleteById(item_id);
  }
}
