import { Module } from '@nestjs/common';
import { StudentClubsService } from './student-clubs.service';
import { StudentClubsController } from './student-clubs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../logger/logger.module';
import { StudentClub } from './entities/student-club.entity';
import { UploadsModule } from '../uploads/uploads.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsConfigService } from '../uploads/uploads.config';
import { UploadsService } from '../uploads/uploads.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentClub]),
    LoggerModule,
    UploadsModule,
    MulterModule.registerAsync({
      imports: [UploadsModule],
      inject: [UploadsConfigService],
      useFactory: (uploadConfigService: UploadsConfigService) => {
        return uploadConfigService.createMulterOptions();
      },
    }),
  ],
  controllers: [StudentClubsController],
  providers: [UploadsService, StudentClubsService],
  exports: [StudentClubsService],
})
export class StudentClubsModule {}
