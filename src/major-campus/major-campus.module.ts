import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../logger/logger.module';
import { MajorCampus } from './entities/major-campus.entity';
import { MajorCampusController } from './major-campus.controller';
import { MajorCampusService } from './major-campus.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MajorCampus]),
    LoggerModule,
  ],
  controllers: [MajorCampusController],
  providers: [MajorCampusService],
  exports: [MajorCampusService],
})
export class MajorCampusModule {}
