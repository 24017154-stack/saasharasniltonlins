import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DashboardService {
  constructor(private databaseService: DatabaseService) {}

  async getOverview(): Promise<{
    totalStudents: number;
    todayBookings: number;
    monthRevenue: number;
    delinquentCount: number;
  }> {
    const today = new Date().toISOString().split('T')[0];
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString().split('T')[0];
    const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      .toISOString().split('T')[0];

    const [
      totalStudentsResult,
      todayBookingsResult,
      monthRevenueResult,
      delinquentCountResult,
    ] = await Promise.all([
      this.databaseService.queryOne<{ count: string }>(
        'SELECT COUNT(*) as count FROM students WHERE status = $1',
        ['ACTIVE'],
      ),
      this.databaseService.queryOne<{ count: string }>(
        'SELECT COUNT(*) as count FROM bookings WHERE scheduled_date = $1 AND status != $2',
        [today, 'CANCELLED'],
      ),
      this.databaseService.queryOne<{ total: string }>(
        `
        SELECT COALESCE(SUM(amount_cents), 0) as total 
        FROM invoices 
        WHERE status = 'PAID' 
        AND paid_at >= $1 
        AND paid_at <= $2
        `,
        [monthStart, monthEnd + ' 23:59:59'],
      ),
      this.databaseService.queryOne<{ count: string }>(
        `
        SELECT COUNT(DISTINCT s.id) as count
        FROM students s
        JOIN invoices i ON s.id = i.student_id
        WHERE i.status = 'PENDING' AND i.due_date < NOW()
        `,
      ),
    ]);

    return {
      totalStudents: parseInt(totalStudentsResult?.count || '0', 10),
      todayBookings: parseInt(todayBookingsResult?.count || '0', 10),
      monthRevenue: parseInt(monthRevenueResult?.total || '0', 10),
      delinquentCount: parseInt(delinquentCountResult?.count || '0', 10),
    };
  }
}