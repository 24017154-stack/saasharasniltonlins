import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { v4 as uuidv4 } from 'uuid';

export interface Holiday {
  id: string;
  name: string;
  date: string;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class HolidaysService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(): Promise<Holiday[]> {
    return this.databaseService.query<Holiday>(
      'SELECT * FROM holidays ORDER BY date ASC',
    );
  }

  async findOne(id: string): Promise<Holiday> {
    const holiday = await this.databaseService.queryOne<Holiday>(
      'SELECT * FROM holidays WHERE id = $1',
      [id],
    );

    if (!holiday) {
      throw new NotFoundException('Holiday not found');
    }

    return holiday;
  }

  async create(createHolidayDto: CreateHolidayDto): Promise<Holiday> {
    const id = uuidv4();
    const holiday = await this.databaseService.queryOne<Holiday>(
      `
      INSERT INTO holidays (id, name, date, is_recurring)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        id,
        createHolidayDto.name,
        createHolidayDto.date,
        createHolidayDto.isRecurring || false,
      ],
    );

    return holiday!;
  }

  async update(id: string, updateHolidayDto: UpdateHolidayDto): Promise<Holiday> {
    const holiday = await this.findOne(id);

    const updateFields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    Object.entries(updateHolidayDto).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbKey = key === 'isRecurring' ? 'is_recurring' : key;
        updateFields.push(`${dbKey} = $${paramIndex}`);
        params.push(value);
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      return holiday;
    }

    params.push(id);
    const updatedHoliday = await this.databaseService.queryOne<Holiday>(
      `UPDATE holidays SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params,
    );

    return updatedHoliday!;
  }

  async remove(id: string): Promise<void> {
    const holiday = await this.findOne(id);
    
    await this.databaseService.query(
      'DELETE FROM holidays WHERE id = $1',
      [id],
    );
  }

  async getHolidayDates(startDate: string, endDate: string): Promise<string[]> {
    const holidays = await this.databaseService.query<{ date: string }>(
      `
      SELECT date::text as date FROM holidays 
      WHERE date BETWEEN $1 AND $2
      OR (is_recurring = true AND EXTRACT(MONTH FROM date) || '-' || EXTRACT(DAY FROM date) IN (
        SELECT EXTRACT(MONTH FROM generate_series($1::date, $2::date, '1 day')::date) || '-' || 
               EXTRACT(DAY FROM generate_series($1::date, $2::date, '1 day')::date)
      ))
      `,
      [startDate, endDate],
    );

    return holidays.map(h => h.date);
  }
}