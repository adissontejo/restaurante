import { Injectable } from '@nestjs/common';
import {
  generateInsertBody,
  generateUpdateSetters,
  inject,
} from 'src/utils/sql';
import { Database } from 'src/database/database.service';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuarioRepository {
    constructor(private readonly db: Database) {}

    async insert(usuario: Omit<Usuario, 'id'>) {
      const result = await this.db.query(`
        INSERT INTO usuario ${generateInsertBody(usuario)}
      `);

      return result;
    }

    async updateById(id: number, usuario: Omit<Partial<Usuario>, 'id'>) {
      const result = await this.db.query(`
        UPDATE usuario
        SET
        ${generateUpdateSetters(usuario)}
        WHERE id = ${inject(id)}
      `);

      return result;
    }

    async deleteById(id: number) {
      const result = await this.db.query(`
        DELETE
        FROM usuario
        WHERE id = ${inject(id)}
      `);

      return result;
    }

    private async baseSelect(sql: string = '') {
      const base = await this.db.query < Usuario[] >
      (`
        SELECT *
        FROM usuario
        ${sql}
      `);

      return base;
    }

    async findAll() {
      const usuarios = await this.baseSelect();

      return usuarios;
    }

    async getById(id: number) {
      const [usuario] = await this.baseSelect(`WHERE id = ${inject(id)}`);

      if (!usuario) {
        return null;
      }

      return usuario;
    }

    async getByEmail(email: string) {
        const [usuario] = await this.baseSelect(
          `WHERE email = ${inject(email)}`,
        );

        if (!usuario) {
          return null;
        }

        return usuario;
      }
}
