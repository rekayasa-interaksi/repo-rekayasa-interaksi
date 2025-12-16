import { Module, Version } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users/entities/users.entitiy';
import { Admin } from 'src/admins/entities/admin.entity';
import { StudentClub } from 'src/student-clubs/entities/student-club.entity';
import { ProgramAlumni } from 'src/programs-alumni/entities/program-alumni.entity';
import { Event } from 'src/events/entities/event.entity';
import { SocialMedia } from 'src/social-media/entities/social-media.entity';
import { StudentCampus } from 'src/student-campus/entities/student-campus.entity';
import { StudentChapter } from 'src/student-chapters/entities/student-chapters.entity';
import { Faq } from 'src/faq/entities/faq.entity';
import { ExternalOrganization } from 'src/external-organizations/entities/external-organization.entity';
import { LoggerModule } from './logger/logger.module';
import { StudentClubsModule } from './student-clubs/student-clubs.module';
import * as dotenv from "dotenv";
import { StudentChaptersModule } from './student-chapters/student-chapters.module';
import { ProgramsAlumniModule } from './programs-alumni/programs-alumni.module';
import { AdminsModule } from './admins/admins.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UploadsService } from './uploads/uploads.service';
import { UploadsModule } from './uploads/uploads.module';
import { EventsModule } from './events/events.module';
import { StudentCampusModule } from './student-campus/student-campus.module'
import { RolesModule } from './roles/roles.module';
import { OrganizationalStructureModule } from './organizational-structure/organizational-structure.module';
import { Roles } from './roles/entities/roles.entity';
import { MajorCampusModule } from './major-campus/major-campus.module';
import { MajorCampus } from './major-campus/entities/major-campus.entity';
import { EventMember } from './events/entities/event-members.entity';
import { Programs } from './programs/entities/programs.entity';
import { ProgramsModule } from './programs/programs.module';
import { DetailEvent } from './events/entities/detail-event.entity';
import { Domisili } from './users/entities/domisili.entity';
import { FaqModule } from './faq/faq.module';
import { ExternalOrganizationModule } from './external-organizations/external-organization.module';
import { OrganizationalStructure } from './organizational-structure/entities/organizational-structure.entity';
import { ConfigModule } from '@nestjs/config';
import { EventImages } from './events/entities/event-images';
import { EventLinks } from './events/entities/event-links';
import { Achievement } from './events/entities/achievement.entity';
import { Histories } from './histories/entities/histories.entity';
import { HistoriesModule } from './histories/histories.module';
import { EventDocumentations } from './events/entities/event-documentations';
import { EmailVerification } from './users/entities/email-verification.entity';
import { HelpCenter } from './help-centers/entities/help-centers.entity';
import { HelpCentersModule } from './help-centers/help-centers.module';
import { EventOrganizations } from './events/entities/event-organization.entity';
import { Logging } from './users/entities/logging.entity';
import { TeamsModule } from './teams/teams.module';
import { Teams } from './teams/entities/teams.entity';
import { VersionSystems } from './teams/entities/version-systems.entity';
import { Features } from './teams/entities/features.entity';
import { EmployerBranding } from './events/entities/employer-brandings.entity';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.DATABASE_URL,
      // host: process.env.DATABASE_HOST,
      // port: Number(process.env.DATABASE_PORT),
      // username: process.env.DATABASE_USERNAME,
      // password: process.env.DATABASE_PASSWORD,
      // database: process.env.DATABASE_NAME,
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [
        Users,
        Admin,
        StudentClub,
        ProgramAlumni,
        Event,
        SocialMedia,
        StudentCampus,
        StudentChapter,
        Roles,
        MajorCampus,
        EventMember,
        Programs,
        DetailEvent,
        Achievement,
        Domisili,
        Faq,
        ExternalOrganization,
        OrganizationalStructure,
        EventImages,
        EventLinks,
        Histories,
        EventDocumentations,
        EmailVerification,
        HelpCenter,
        EventOrganizations,
        Logging,
        Teams,
        VersionSystems,
        Features,
        EmployerBranding
      ],
      synchronize: false,
      logging: true,
    }),
      LoggerModule,
      StudentClubsModule,
      StudentChaptersModule,
      ProgramsAlumniModule,
      AdminsModule,
      UsersModule,
      AuthModule,
      UploadsModule,
      StudentCampusModule,
      EventsModule,
      RolesModule,
      MajorCampusModule,
      ProgramsModule,
      FaqModule,
      ExternalOrganizationModule,
      OrganizationalStructureModule,
      HistoriesModule,
      HelpCentersModule,
      TeamsModule
    ],
    providers: [UploadsService],
})

export class AppModule { }
