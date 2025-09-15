import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MarkAttendanceDto {
  @ApiProperty({ enum: ['COMPLETED', 'NO_SHOW'] })
  @IsIn(['COMPLETED', 'NO_SHOW'])
  status: 'COMPLETED' | 'NO_SHOW';

  @ApiPropertyOptional({ example: 'Student showed great improvement' })
  @IsOptional()
  @IsString()
  notes?: string;
}