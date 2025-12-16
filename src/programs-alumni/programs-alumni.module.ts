import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../logger/logger.module';
import { ProgramAlumni } from './entities/program-alumni.entity';
import { ProgramsAlumniController } from './programs-alumni.controller';
import { ProgramsAlumniService } from './programs-alumni.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProgramAlumni]),
    LoggerModule,
  ],
  controllers: [ProgramsAlumniController],
  providers: [ProgramsAlumniService],
  exports: [ProgramsAlumniService],
})
export class ProgramsAlumniModule {}
