import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../logger/logger.module';
import { StudentCampus } from './entities/student-campus.entity';
import { StudentCampusController } from './student-campus.controller';
import { StudentCampusService } from './student-campus.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentCampus]),
    LoggerModule,
  ],
  controllers: [StudentCampusController],
  providers: [StudentCampusService],
  exports: [StudentCampusService],
})
export class StudentCampusModule {}
