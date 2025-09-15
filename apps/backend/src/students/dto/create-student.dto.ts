import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'joao@example.com' })
  @IsEmail()
  email: string;

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
}