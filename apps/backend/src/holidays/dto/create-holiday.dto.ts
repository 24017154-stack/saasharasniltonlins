import { IsString, IsDateString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHolidayDto {
  @ApiProperty({ example: 'Natal' })
  @IsString()
  name: string;

  @ApiProperty({ example: '2024-12-25' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;
}