import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolConnection, createPool } from 'mysql2/promise';

@Injectable()
export class Database implements OnModuleInit, OnModuleDestroy {
  private pool?: Pool;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.pool = createPool({
      host: this.configService.get('DATABASE_HOST'),
      port: this.configService.get('DATABASE_PORT'),
      user: this.configService.get('DATABASE_USER'),
      password: this.configService.get('DATABASE_PASSWORD'),
      database: 'restaurante',
      namedPlaceholders: true,
    });
  }

  async onModuleDestroy() {
    if (this.pool) {
      this.pool.end();
    }
  }

  private async _query<T>(
    sql: string,
    params?: any,
    connection?: PoolConnection,
  ) {
    if (!connection) {
      if (!this.pool) {
        throw new Error('Pool not created');
      }

      connection = await this.pool.getConnection();
    }

    const [rows] = await connection.query(sql, params);

    return rows as T;
  }

  async query<T>(sql: string, params?: any) {
    if (!this.pool) {
      throw new Error('Pool not created');
    }

    const results = await this._query<T>(sql, params);

    return results;
  }

  async transaction() {
    if (!this.pool) {
      throw new Error('Pool not created');
    }

    const connection = await this.pool.getConnection();

    const transaction = {
      query: <T>(sql: string, params?: any) =>
        this._query<T>(sql, params, connection),
      finish: () => [connection.query('COMMIT;'), connection.end()],
    };

    connection.query(`START TRANSACTION;`);

    return transaction;
  }
}
