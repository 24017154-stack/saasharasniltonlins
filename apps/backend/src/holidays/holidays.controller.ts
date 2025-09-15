import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HolidaysService } from './holidays.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('holidays')
@Controller('holidays')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Get()
  @ApiOperation({ summary: 'Get all holidays' })
  @ApiResponse({ status: 200, description: 'Holidays retrieved successfully' })
  async findAll() {
    const holidays = await this.holidaysService.findAll();
    return holidays.map(holiday => ({
      id: holiday.id,
      name: holiday.name,
      date: holiday.date,
      isRecurring: holiday.is_recurring,
      createdAt: holiday.created_at,
      updatedAt: holiday.updated_at,
    }));
  }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new holiday' })
  @ApiResponse({ status: 201, description: 'Holiday created successfully' })
  async create(@Body() createHolidayDto: CreateHolidayDto) {
    const holiday = await this.holidaysService.create(createHolidayDto);
    return {
      id: holiday.id,
      name: holiday.name,
      date: holiday.date,
      isRecurring: holiday.is_recurring,
      createdAt: holiday.created_at,
      updatedAt: holiday.updated_at,
    };
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update holiday' })
  @ApiResponse({ status: 200, description: 'Holiday updated successfully' })
  @ApiResponse({ status: 404, description: 'Holiday not found' })
  async update(@Param('id') id: string, @Body() updateHolidayDto: UpdateHolidayDto) {
    const holiday = await this.holidaysService.update(id, updateHolidayDto);
    return {
      id: holiday.id,
      name: holiday.name,
      date: holiday.date,
      isRecurring: holiday.is_recurring,
      createdAt: holiday.created_at,
      updatedAt: holiday.updated_at,
    };
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete holiday' })
  @ApiResponse({ status: 200, description: 'Holiday deleted successfully' })
  @ApiResponse({ status: 404, description: 'Holiday not found' })
  async remove(@Param('id') id: string) {
    await this.holidaysService.remove(id);
    return { message: 'Holiday deleted successfully' };
  }
}