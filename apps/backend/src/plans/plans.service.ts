import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface Plan {
  id: string;
  name: string;
  description?: string;
  price_cents: number;
  credits_included: number;
  duration_days: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class PlansService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(): Promise<Plan[]> {
    return this.databaseService.query<Plan>(
      'SELECT * FROM plans WHERE is_active = true ORDER BY price_cents ASC',
    );
  }

  async findOne(id: string): Promise<Plan | null> {
    return this.databaseService.queryOne<Plan>(
      'SELECT * FROM plans WHERE id = $1',
      [id],
    );
  }
}