import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { UploadsService } from '../uploads/uploads.service';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsConfigService } from '../uploads/uploads.config';
import { UploadsModule } from '../uploads/uploads.module';
import { EventsService } from './events.service';
import { LoggerModule } from '../logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { StudentClub } from '../student-clubs/entities/student-club.entity';
import { Programs } from '../programs/entities/programs.entity';
import { DetailEvent } from './entities/detail-event.entity';
import { Users } from '../users/entities/users.entitiy';
import { StudentCampus } from '../student-campus/entities/student-campus.entity';
import { MajorCampus } from '../major-campus/entities/major-campus.entity';
import { EventMember } from './entities/event-members.entity';
import { Domisili } from '../users/entities/domisili.entity';
import { StudentChapter } from '../student-chapters/entities/student-chapters.entity';
import { EventImages } from './entities/event-images';
import { EventLinks } from './entities/event-links';
import { EventDocumentations } from './entities/event-documentations';
import { Roles } from 'src/roles/entities/roles.entity';
import { EmailVerification } from 'src/users/entities/email-verification.entity';
import { EventOrganizations } from './entities/event-organization.entity';
import { ExternalOrganization } from 'src/external-organizations/entities/external-organization.entity';
import { Achievement } from './entities/achievement.entity';
import { EmployerBranding } from './entities/employer-brandings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event, 
      StudentClub, 
      Programs, 
      DetailEvent, 
      Users, 
      StudentCampus, 
      MajorCampus, 
      EventMember, 
      Domisili, 
      StudentChapter, 
      EventImages, 
      EventLinks, 
      EventDocumentations, 
      Roles,
      EmailVerification,
      EventOrganizations,
      ExternalOrganization,
      Achievement,
      EmployerBranding
    ]),
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
  controllers: [EventsController],
  providers: [UploadsService, EventsService],
  exports: [EventsService],
})
export class EventsModule {}