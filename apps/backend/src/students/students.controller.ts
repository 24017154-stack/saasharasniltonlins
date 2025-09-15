import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { RenewStudentDto } from './dto/renew-student.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('students')
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all students' })
  @ApiQuery({ name: 'status', required: false, enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name or email' })
  @ApiResponse({ status: 200, description: 'Students retrieved successfully' })
  async findAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const result = await this.studentsService.findAll(status, search);
    return {
      data: result.data.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        birthDate: student.birth_date,
        emergencyContactName: student.emergency_contact_name,
        emergencyContactPhone: student.emergency_contact_phone,
        medicalNotes: student.medical_notes,
        status: student.status,
        createdAt: student.created_at,
        updatedAt: student.updated_at,
      })),
      total: result.total,
      page: 1,
      limit: result.total,
      totalPages: 1,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by id' })
  @ApiResponse({ status: 200, description: 'Student retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async findOne(@Param('id') id: string) {
    const student = await this.studentsService.findOne(id);
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      birthDate: student.birth_date,
      emergencyContactName: student.emergency_contact_name,
      emergencyContactPhone: student.emergency_contact_phone,
      medicalNotes: student.medical_notes,
      status: student.status,
      createdAt: student.created_at,
      updatedAt: student.updated_at,
    };
  }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, description: 'Student created successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() createStudentDto: CreateStudentDto) {
    const student = await this.studentsService.create(createStudentDto);
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      birthDate: student.birth_date,
      emergencyContactName: student.emergency_contact_name,
      emergencyContactPhone: student.emergency_contact_phone,
      medicalNotes: student.medical_notes,
      status: student.status,
      createdAt: student.created_at,
      updatedAt: student.updated_at,
    };
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update student' })
  @ApiResponse({ status: 200, description: 'Student updated successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    const student = await this.studentsService.update(id, updateStudentDto);
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      birthDate: student.birth_date,
      emergencyContactName: student.emergency_contact_name,
      emergencyContactPhone: student.emergency_contact_phone,
      medicalNotes: student.medical_notes,
      status: student.status,
      createdAt: student.created_at,
      updatedAt: student.updated_at,
    };
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get student history' })
  @ApiResponse({ status: 200, description: 'Student history retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getHistory(@Param('id') id: string) {
    return this.studentsService.getStudentHistory(id);
  }

  @Post(':id/renew')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Renew student subscription' })
  @ApiResponse({ status: 201, description: 'Subscription renewed successfully' })
  @ApiResponse({ status: 404, description: 'Student or plan not found' })
  async renew(@Param('id') id: string, @Body() renewDto: RenewStudentDto) {
    return this.studentsService.renewStudent(id, renewDto);
  }
}