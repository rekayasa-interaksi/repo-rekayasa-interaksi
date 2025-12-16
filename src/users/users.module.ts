import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entitiy';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { StudentCampus } from '../student-campus/entities/student-campus.entity';
import { SocialMedia } from '../social-media/entities/social-media.entity';
import { MajorCampus } from '../major-campus/entities/major-campus.entity';
import { Domisili } from './entities/domisili.entity';
import { StudentChapter } from 'src/student-chapters/entities/student-chapters.entity';
import { EmailVerification } from './entities/email-verification.entity';
import { Roles } from 'src/roles/entities/roles.entity';
import { UploadsModule } from 'src/uploads/uploads.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsConfigService } from 'src/uploads/uploads.config';
import { UploadsService } from 'src/uploads/uploads.service';
import { Logging } from './entities/logging.entity';
import { StudentClub } from 'src/student-clubs/entities/student-club.entity';
import { ProgramAlumni } from 'src/programs-alumni/entities/program-alumni.entity';
import { Programs } from 'src/programs/entities/programs.entity';
import { OrganizationalStructure } from 'src/organizational-structure/entities/organizational-structure.entity';
import { Event } from 'src/events/entities/event.entity';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users, 
      StudentCampus, 
      SocialMedia, 
      MajorCampus, 
      Domisili, 
      StudentChapter, 
      EmailVerification, 
      Roles,
      Logging,
      StudentClub,
      ProgramAlumni,
      Event,
      Programs,
      OrganizationalStructure
    ]),
    UploadsModule,
    LoggerModule,
    MulterModule.registerAsync({
      imports: [UploadsModule],
      inject: [UploadsConfigService],
      useFactory: (uploadConfigService: UploadsConfigService) => {
        return uploadConfigService.createMulterOptions();
      },
    }),
  ],
  providers: [UploadsService, UsersService],
  controllers: [UsersController],
  exports: [UsersService], 
})
export class UsersModule {}
