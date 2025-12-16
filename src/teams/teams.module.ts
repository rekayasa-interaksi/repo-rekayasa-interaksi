import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { LoggerModule } from '../logger/logger.module';
import { Teams } from './entities/teams.entity';
import { VersionSystems } from './entities/version-systems.entity';
import { Features } from './entities/features.entity';
import { Users } from 'src/users/entities/users.entitiy';
import { SocialMedia } from 'src/social-media/entities/social-media.entity';
import { UploadsModule } from 'src/uploads/uploads.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsConfigService } from 'src/uploads/uploads.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Teams, VersionSystems, Features, Users, SocialMedia ]),
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
  providers: [TeamsService],
  controllers: [TeamsController],
  exports: [TeamsService],
})
export class TeamsModule {}
