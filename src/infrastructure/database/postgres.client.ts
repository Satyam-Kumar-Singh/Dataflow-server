import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient, QueryResult } from 'pg';

@Injectable()
export class PostgresClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  private readonly logger = new Logger(PostgresClient.name);

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.pool = new Pool({
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      user: this.configService.get<string>('database.user'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.name'),
    });

    try {
      await this.pool.query('SELECT 1'); // ✅ test query instead of leaving a client open
      this.logger.log(`✅ Connected to database: ${this.configService.get<string>('database.name')}`);
    } catch (error) {
      this.logger.error('❌ Failed to connect to PostgreSQL database', error.stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
    this.logger.log('❌ Database connection closed');
  }

  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const client: PoolClient = await this.pool.connect();
    try {
      const result = await client.query<T>(text, params);
      return result;
    } catch (error) {
      this.logger.error('Database query error', error.stack);
      throw error;
    } finally {
      client.release();
    }
  }

  async getClient(): Promise<PoolClient> {
    try {
      return await this.pool.connect();
    } catch (error) {
      this.logger.error('Failed to get database client', error.stack);
      throw error;
    }
  }

  async runTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      this.logger.error('Transaction failed, rolled back', error.stack);
      throw error;
    } finally {
      client.release();
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error.stack);
      return false;
    }
  }
}
