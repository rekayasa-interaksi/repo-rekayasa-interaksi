import { Module } from '@nestjs/common';
import { UploadsConfigService } from './uploads.config';
import { UploadsService } from './uploads.service';

@Module({
  providers: [UploadsConfigService, UploadsService],
  exports: [UploadsConfigService, UploadsService],
})
export class UploadsModule {}
