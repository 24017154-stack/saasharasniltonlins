import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string;

  @IsString()
  REDIS_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  SMTP_HOST: string;

  @IsNumber()
  SMTP_PORT: number;

  @IsOptional()
  @IsString()
  SMTP_USER?: string;

  @IsOptional()
  @IsString()
  SMTP_PASS?: string;

  @IsString()
  EMAIL_FROM: string;

  @IsOptional()
  @IsString()
  STRIPE_SECRET_KEY?: string;

  @IsOptional()
  @IsString()
  STRIPE_WEBHOOK_SECRET?: string;

  @IsIn(['mock', 'stripe'])
  PAYMENT_PROVIDER: 'mock' | 'stripe' = 'mock';

  @IsNumber()
  CANCELLATION_REFUND_WINDOW_HOURS: number;

  @IsString()
  TIMEZONE: string;

  @IsString()
  LANGUAGE: string;

  @IsIn(['development', 'production', 'test'])
  NODE_ENV: 'development' | 'production' | 'test';

  @IsNumber()
  PORT: number;

  @IsOptional()
  @IsString()
  FRONTEND_URL?: string;
}

export const validate = (config: Record<string, unknown>) => {
  // Transform string values to appropriate types
  const processedConfig = {
    ...config,
    SMTP_PORT: parseInt(config.SMTP_PORT as string, 10) || 1025,
    CANCELLATION_REFUND_WINDOW_HOURS: parseInt(config.CANCELLATION_REFUND_WINDOW_HOURS as string, 10) || 12,
    PORT: parseInt(config.PORT as string, 10) || 3001,
    PAYMENT_PROVIDER: config.PAYMENT_PROVIDER || 'mock',
  };

  return processedConfig;
};