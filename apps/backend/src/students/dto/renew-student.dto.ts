import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RenewStudentDto {
  @ApiProperty({ example: 'plan-basic-monthly' })
  @IsUUID()
  planId: string;
}