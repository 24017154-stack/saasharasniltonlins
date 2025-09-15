import { IsString, IsEmail, IsOptional, IsDateString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStudentDto {
  @ApiPropertyOptional({ example: 'João Silva' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'joao@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+5511999999999' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ example: 'Maria Silva' })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiPropertyOptional({ example: '+5511888888888' })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiPropertyOptional({ example: 'Alergia a medicamentos' })
  @IsOptional()
  @IsString()
  medicalNotes?: string;

  @ApiPropertyOptional({ enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] })
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}