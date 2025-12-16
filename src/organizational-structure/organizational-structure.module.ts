import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationalStructure } from './entities/organizational-structure.entity';
import { OrganizationalStructureService } from './organizational-structure.service';
import { OrganizationalStructureController } from './organizational-structure.controller';
import { UploadsModule } from '../uploads/uploads.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsConfigService } from '../uploads/uploads.config';
import { UploadsService } from '../uploads/uploads.service';
import { SocialMedia } from 'src/social-media/entities/social-media.entity';
import { StudentChapter } from 'src/student-chapters/entities/student-chapters.entity';
import { StudentClub } from 'src/student-clubs/entities/student-club.entity';
import { Users } from 'src/users/entities/users.entitiy';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationalStructure, SocialMedia, StudentChapter, StudentClub, Users]),
    UploadsModule,
    MulterModule.registerAsync({
      imports: [UploadsModule],
      inject: [UploadsConfigService],
      useFactory: (uploadConfigService: UploadsConfigService) => {
        return uploadConfigService.createMulterOptions();
      },
    }),
  ],
  controllers: [OrganizationalStructureController],
  providers: [UploadsService, OrganizationalStructureService],
})
export class OrganizationalStructureModule {}
