import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../logger/logger.module';
import { HelpCenter } from './entities/help-centers.entity';
import { HelpCentersController } from './help-centers.controller';
import { HelpCentersService } from './help-centers.service';
import { Users } from 'src/users/entities/users.entitiy';

@Module({
  imports: [
    TypeOrmModule.forFeature([HelpCenter, Users]),
    LoggerModule,
  ],
  controllers: [HelpCentersController],
  providers: [HelpCentersService],
  exports: [HelpCentersService],
})
export class HelpCentersModule {}
