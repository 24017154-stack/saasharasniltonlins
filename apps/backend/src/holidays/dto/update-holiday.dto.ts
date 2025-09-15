import { IsString, IsDateString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateHolidayDto {
  @ApiPropertyOptional({ example: 'Natal' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '2024-12-25' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;
}