import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { AppConfigService } from '../config/app-config.service';

@Module({
  providers: [DatabaseService, AppConfigService],
  exports: [DatabaseService],
})
export class DatabaseModule {}