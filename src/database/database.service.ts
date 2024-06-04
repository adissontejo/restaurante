import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createNamespace } from 'cls-hooked';
import {
  Pool,
  PoolConnection,
  ResultSetHeader,
  createPool,
} from 'mysql2/promise';

const connectionKey = 'CONNECTION';

type ConnectionKey = typeof connectionKey;

const connectionNamespace = createNamespace<
  Partial<
    Record<ConnectionKey, PoolConnection> & {
      random: number;
    }
  >
>('CONNECTION-NAMESPACE');

@Injectable()
export class Database implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.pool = createPool({
      host: this.configService.get('DATABASE_HOST'),
      port: this.configService.get('DATABASE_PORT'),
      user: this.configService.get('DATABASE_USER'),
      password: this.configService.get('DATABASE_PASSWORD'),
      database: 'restaurante',
      namedPlaceholders: true,
      nestTables: true,
      connectionLimit: 20,
    });
  }

  async onModuleDestroy() {
    if (this.pool) {
      this.pool.end();
    }
  }

  async query<T = ResultSetHeader>(sql: string, params?: any) {
    const connection = connectionNamespace.get(connectionKey);

    console.log(sql);

    let result: any;

    if (!connection) {
      [result] = await this.pool.query(sql, params);
    } else {
      [result] = await connection.query(sql, params);
    }

    return result as T;
  }

  async transaction<T>(fn: () => T) {
    let connection = connectionNamespace.get(connectionKey);

    if (connection) {
      return fn();
    }

    connection = await this.pool.getConnection();

    const { result, error } = await connectionNamespace.runAndReturn(
      async () => {
        connectionNamespace.set(connectionKey, connection);
        connectionNamespace.set('random', Math.random());

        let result: T | undefined = undefined;
        let error: Error | undefined = undefined;

        try {
          await this.query(`SET autocommit = 0;`);

          await this.query('START TRANSACTION;');

          result = await fn();

          await this.query('COMMIT;');
        } catch (e) {
          error = e;

          await this.query('ROLLBACK;');
        } finally {
          connection.release();

          this.pool.releaseConnection(connection);

          return { result, error };
        }
      },
    );

    if (error) {
      throw error;
    } else {
      return result as T;
    }
  }
}
