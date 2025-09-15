import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { AppConfigService } from '../config/app-config.service';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor(private configService: AppConfigService) {}

  async onModuleInit() {
    this.pool = new Pool({
      connectionString: this.configService.databaseUrl,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test connection
    try {
      const client = await this.pool.connect();
      client.release();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
    const rows = await this.query<T>(text, params);
    return rows[0] || null;
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // SQL template literal helper
  sql(strings: TemplateStringsArray, ...values: any[]): { text: string; values: any[] } {
    let text = strings[0];
    const sqlValues: any[] = [];

    for (let i = 1; i < strings.length; i++) {
      text += `$${sqlValues.length + 1}${strings[i]}`;
      sqlValues.push(values[i - 1]);
    }

    return { text, values: sqlValues };
  }

  async sqlQuery<T = any>(template: { text: string; values: any[] }): Promise<T[]> {
    return this.query<T>(template.text, template.values);
  }

  async sqlQueryOne<T = any>(template: { text: string; values: any[] }): Promise<T | null> {
    return this.queryOne<T>(template.text, template.values);
  }
}