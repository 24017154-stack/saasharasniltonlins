import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('plans')
@Controller('plans')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active plans' })
  @ApiResponse({ status: 200, description: 'Plans retrieved successfully' })
  async findAll() {
    const plans = await this.plansService.findAll();
    return plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      priceCents: plan.price_cents,
      creditsIncluded: plan.credits_included,
      durationDays: plan.duration_days,
      isActive: plan.is_active,
      createdAt: plan.created_at,
      updatedAt: plan.updated_at,
    }));
  }
}