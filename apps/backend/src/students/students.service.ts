import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { RenewStudentDto } from './dto/renew-student.dto';
import { v4 as uuidv4 } from 'uuid';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birth_date?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_notes?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  created_at: string;
  updated_at: string;
}

@Injectable()
export class StudentsService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(status?: string, search?: string): Promise<{ data: Student[]; total: number }> {
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      whereClause += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (search) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const countQuery = `SELECT COUNT(*) as total FROM students ${whereClause}`;
    const dataQuery = `
      SELECT * FROM students 
      ${whereClause}
      ORDER BY created_at DESC
    `;

    const [countResult, students] = await Promise.all([
      this.databaseService.queryOne<{ total: string }>(countQuery, params),
      this.databaseService.query<Student>(dataQuery, params),
    ]);

    return {
      data: students,
      total: parseInt(countResult?.total || '0', 10),
    };
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.databaseService.queryOne<Student>(
      'SELECT * FROM students WHERE id = $1',
      [id],
    );

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // Check if email already exists
    const existingStudent = await this.databaseService.queryOne(
      'SELECT id FROM students WHERE email = $1',
      [createStudentDto.email.toLowerCase()],
    );

    if (existingStudent) {
      throw new ConflictException('Email already exists');
    }

    const id = uuidv4();
    const student = await this.databaseService.queryOne<Student>(
      `
      INSERT INTO students (
        id, name, email, phone, birth_date, emergency_contact_name, 
        emergency_contact_phone, medical_notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [
        id,
        createStudentDto.name,
        createStudentDto.email.toLowerCase(),
        createStudentDto.phone,
        createStudentDto.birthDate,
        createStudentDto.emergencyContactName,
        createStudentDto.emergencyContactPhone,
        createStudentDto.medicalNotes,
      ],
    );

    return student!;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);

    // Check if email already exists (excluding current student)
    if (updateStudentDto.email) {
      const existingStudent = await this.databaseService.queryOne(
        'SELECT id FROM students WHERE email = $1 AND id != $2',
        [updateStudentDto.email.toLowerCase(), id],
      );

      if (existingStudent) {
        throw new ConflictException('Email already exists');
      }
    }

    const updateFields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    Object.entries(updateStudentDto).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbKey = key === 'birthDate' ? 'birth_date' : 
                      key === 'emergencyContactName' ? 'emergency_contact_name' :
                      key === 'emergencyContactPhone' ? 'emergency_contact_phone' :
                      key === 'medicalNotes' ? 'medical_notes' : key;
        
        updateFields.push(`${dbKey} = $${paramIndex}`);
        params.push(key === 'email' ? value.toLowerCase() : value);
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      return student;
    }

    params.push(id);
    const updatedStudent = await this.databaseService.queryOne<Student>(
      `UPDATE students SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params,
    );

    return updatedStudent!;
  }

  async getStudentHistory(id: string): Promise<{ bookings: any[]; invoices: any[] }> {
    await this.findOne(id); // Ensure student exists

    const [bookings, invoices] = await Promise.all([
      this.databaseService.query(
        `
        SELECT b.*, ts.start_time, ts.end_time, u.name as instructor_name
        FROM bookings b
        LEFT JOIN time_slots ts ON b.time_slot_id = ts.id
        LEFT JOIN users u ON b.instructor_id = u.id
        WHERE b.student_id = $1
        ORDER BY b.scheduled_start DESC
        LIMIT 20
        `,
        [id],
      ),
      this.databaseService.query(
        `
        SELECT i.*, p.name as plan_name
        FROM invoices i
        LEFT JOIN subscriptions s ON i.subscription_id = s.id
        LEFT JOIN plans p ON s.plan_id = p.id
        WHERE i.student_id = $1
        ORDER BY i.created_at DESC
        LIMIT 20
        `,
        [id],
      ),
    ]);

    return { bookings, invoices };
  }

  async renewStudent(id: string, renewDto: RenewStudentDto): Promise<{ subscription: any; invoice: any }> {
    const student = await this.findOne(id);
    
    const plan = await this.databaseService.queryOne(
      'SELECT * FROM plans WHERE id = $1 AND is_active = true',
      [renewDto.planId],
    );

    if (!plan) {
      throw new NotFoundException('Plan not found or inactive');
    }

    const subscriptionId = uuidv4();
    const invoiceId = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + plan.duration_days * 24 * 60 * 60 * 1000);
    const dueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days to pay

    return this.databaseService.transaction(async (client) => {
      // Create subscription
      const subscription = await client.query(
        `
        INSERT INTO subscriptions (id, student_id, plan_id, starts_at, expires_at, status)
        VALUES ($1, $2, $3, $4, $5, 'ACTIVE')
        RETURNING *
        `,
        [subscriptionId, id, renewDto.planId, now, expiresAt],
      );

      // Create invoice
      const invoice = await client.query(
        `
        INSERT INTO invoices (id, student_id, subscription_id, amount_cents, due_date, status)
        VALUES ($1, $2, $3, $4, $5, 'PENDING')
        RETURNING *
        `,
        [invoiceId, id, subscriptionId, plan.price_cents, dueDate],
      );

      return {
        subscription: subscription.rows[0],
        invoice: invoice.rows[0],
      };
    });
  }

  async getStudentCredits(id: string): Promise<number> {
    const result = await this.databaseService.queryOne<{ total: string }>(
      'SELECT COALESCE(SUM(amount), 0) as total FROM credit_ledger WHERE student_id = $1',
      [id],
    );

    return parseInt(result?.total || '0', 10);
  }
}