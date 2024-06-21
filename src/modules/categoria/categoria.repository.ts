import { Injectable } from '@nestjs/common';
import {
  generateInsertBody,
  generateMultiInsertBody,
  generateUpdateSetters,
  inject,
} from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { Categoria } from './categoria.entity';

@Injectable()
export class CategoriaRepository {
    constructor(private readonly db: Database) {}

    async insert(categoria: Omit<Categoria, 'id'>) {
        const result = await this.db.query(`
            INSERT INTO categoria ${generateInsertBody(categoria)}
            `);

        return result;
    }

    async insertMany(categorias: Categoria[]) {
      const result = await this.db.query(`
        INSERT INTO categoria ${generateMultiInsertBody(categorias)}
      `);
  
      return result;
    }

    async updateById(id: number, categoria: Omit<Partial<Categoria>, 'id'>) {
        const result = await this.db.query(`
          UPDATE categoria
          SET
          ${generateUpdateSetters(categoria)}
          WHERE id = ${inject(id)}
        `);
    
        return result
    }

    async deleteById(id: number) {
        const result = await this.db.query(`
          DELETE
          FROM categoria
          WHERE id = ${inject(id)}
        `);
    
        return result;
      }

    private async baseSelect(sql: string = '') {
        const base = await this.db.query < {i: Categoria}[] >
        (`
          SELECT *
          FROM categoria i
          ${sql}
        `);
  
        return base.map(categoria => categoria.i);
    }

    async findAll() {
        const categorias = await this.baseSelect();
  
        return categorias;
    }

    async getById(id: number) {
        const [categoria] = await this.baseSelect(`WHERE i.id = ${inject(id)}`);
  
        if (!categoria) {
          return null;
        }
  
        return categoria;
    }

}
