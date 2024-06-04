import { Injectable } from '@nestjs/common';
import { Database } from 'src/database/database.service';
import { generateMultiInsertBody, inject } from 'src/utils/sql';
import { HorarioRestaurante } from './horario-restaurante.entity';

@Injectable()
export class HorarioRestauranteRepository {
  constructor(private readonly db: Database) {}

  async insertMany(horariosRestaurante: HorarioRestaurante[]) {
    const result = await this.db.query(`
      INSERT INTO horario_restaurante ${generateMultiInsertBody(horariosRestaurante)}
    `);

    return result;
  }

  async deleteByRestaurante(restauranteId: number) {
    const result = await this.db.query(`
      DELETE
      FROM horario_restaurante
      WHERE restaurante_id = ${inject(restauranteId)}
    `);

    return result;
  }
}
