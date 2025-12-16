import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../logger/logger.module';
import { StudentChapter } from './entities/student-chapters.entity';
import { StudentChaptersController } from './student-chapters.controller';
import { StudentChaptersService } from './student-chapters.service';
import { UploadsModule } from '../uploads/uploads.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsConfigService } from '../uploads/uploads.config';
import { UploadsService } from '../uploads/uploads.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentChapter]),
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
  controllers: [StudentChaptersController],
  providers: [UploadsService, StudentChaptersService],
  exports: [StudentChaptersService],
})
export class StudentChaptersModule {}
