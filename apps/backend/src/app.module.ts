import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { PlansModule } from './plans/plans.module';
import { HolidaysModule } from './holidays/holidays.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { validate } from './config/environment';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    DatabaseModule,
    AuthModule,
    StudentsModule,
    PlansModule,
    HolidaysModule,
    DashboardModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
