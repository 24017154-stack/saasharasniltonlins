import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CancelBookingDto {
  @ApiPropertyOptional({ example: 'Student is sick' })
  @IsOptional()
  @IsString()
  reason?: string;
}