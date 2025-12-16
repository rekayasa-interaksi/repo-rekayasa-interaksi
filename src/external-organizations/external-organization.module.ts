import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalOrganization } from './entities/external-organization.entity';
import { ExternalOrganizationService } from './external-organization.service';
import { ExternalOrganizationController } from './external-organization.controller';
import { UploadsModule } from '../uploads/uploads.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsConfigService } from '../uploads/uploads.config';
import { UploadsService } from '../uploads/uploads.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExternalOrganization]),
    UploadsModule,
    MulterModule.registerAsync({
      imports: [UploadsModule],
      inject: [UploadsConfigService],
      useFactory: (uploadConfigService: UploadsConfigService) => {
        return uploadConfigService.createMulterOptions();
      },
    }),
  ],
  controllers: [ExternalOrganizationController],
  providers: [UploadsService, ExternalOrganizationService],
})
export class ExternalOrganizationModule {}
