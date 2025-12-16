import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Histories } from './entities/histories.entity';
import { HistoriesService } from './histories.service';
import { HistoriesController } from './histories.controller';
import { UploadsModule } from '../uploads/uploads.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsConfigService } from '../uploads/uploads.config';
import { UploadsService } from '../uploads/uploads.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Histories]),
    UploadsModule,
    MulterModule.registerAsync({
      imports: [UploadsModule],
      inject: [UploadsConfigService],
      useFactory: (uploadConfigService: UploadsConfigService) => {
        return uploadConfigService.createMulterOptions();
      },
    }),
  ],
  controllers: [HistoriesController],
  providers: [UploadsService, HistoriesService],
})
export class HistoriesModule {}
