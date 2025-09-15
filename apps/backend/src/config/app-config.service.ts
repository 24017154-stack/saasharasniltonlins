import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }

  get redisUrl(): string {
    return this.configService.get<string>('REDIS_URL');
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  get smtpConfig() {
    return {
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    };
  }

  get emailFrom(): string {
    return this.configService.get<string>('EMAIL_FROM');
  }

  get stripeConfig() {
    return {
      secretKey: this.configService.get<string>('STRIPE_SECRET_KEY'),
      webhookSecret: this.configService.get<string>('STRIPE_WEBHOOK_SECRET'),
    };
  }

  get paymentProvider(): 'mock' | 'stripe' {
    return this.configService.get<'mock' | 'stripe'>('PAYMENT_PROVIDER');
  }

  get cancellationRefundWindowHours(): number {
    return this.configService.get<number>('CANCELLATION_REFUND_WINDOW_HOURS');
  }

  get timezone(): string {
    return this.configService.get<string>('TIMEZONE');
  }

  get language(): string {
    return this.configService.get<string>('LANGUAGE');
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }

  get port(): number {
    return this.configService.get<number>('PORT');
  }

  get frontendUrl(): string {
    return this.configService.get<string>('FRONTEND_URL');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }
}