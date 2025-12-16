import { BadRequestException, Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { ProgramsDto } from './dto/programs.dto';
import { validate } from 'class-validator';
import { Programs } from './entities/programs.entity';
import { QueryGetAllDto } from 'src/users/dto/query-get-all.dto';

@Injectable()
export class ProgramsService {
  constructor(
    private readonly loggerService: LoggerService,
    @InjectRepository(Programs) private programsRepository: Repository<Programs>,
  ) {}

  async createPrograms(programDto: ProgramsDto) {
    await validate(programDto).then((errors) => {
      if (errors.length > 0) {
        this.loggerService.debug(`${errors}`, ProgramsDto.name);
      }
    });

    const existing = await this.programsRepository.findOne({
      where: {
        name: Raw(alias => `LOWER(${alias}) = LOWER(:name)`, {
          name: programDto.name
        })
      }
    });

    if (existing) {
      throw new BadRequestException("Data Program already exist!");
    }

    await this.programsRepository.save({ ...programDto, created_at: new Date() });

    return { status: 'success', message: 'Program created successfully!' };
  }

  async getAllPrograms(queryDto: QueryGetAllDto) {
    const { page, limit, query } = queryDto;

    const qb = this.programsRepository
      .createQueryBuilder('program')
      .loadRelationCountAndMap('program.event_count', 'program.events');

    if (query) {
      qb.where('LOWER(program.name) LIKE LOWER(:query)', {
        query: `%${query.toLowerCase()}%`,
      });
    }

    if (page && limit) {
      qb.take(Number(limit));
      qb.skip((Number(page) - 1) * Number(limit));
    }

    const [data, count] = await qb.getManyAndCount();

    const metaData = {
      page: page ? Number(page) : null,
      limit: limit ? Number(limit) : null,
      totalData: count,
      totalPage: page && limit ? Math.ceil(count / Number(limit)) : 1,
    };

    return {
      status: 'success',
      message: 'Programs retrieved successfully!',
      data,
      metaData,
    };
  }

  async getOnePrograms(id: string) {
    const data = await this.programsRepository.findOne({ where: { id } });
    if (!data) {
      return { status: 'error', message: 'Program does not exist' };
    }

    return { status: 'success', message: 'Program updated successfully!', data };
  }

  async updatePrograms(id: string, programAlumniDto: ProgramsDto) {
    const errors = await validate(programAlumniDto);
    if (errors.length > 0) {
      this.loggerService.debug(`${errors}`, ProgramsDto.name);
      throw new Error('Validation failed');
    }

    const existingClub = await this.programsRepository.findOne({ where: { id } });
    if (!existingClub) {
      return { status: 'error', message: 'Program does not exist' };
    }

    await this.programsRepository.update(id, {
      ...programAlumniDto,
      updated_at: new Date(),
    });

    return { status: 'success', message: 'Program updated successfully!' };
  }

  async deletePrograms(id: string) {
    const program = await this.programsRepository
      .createQueryBuilder('program')
      .where('program.id = :id', { id })
      .loadRelationCountAndMap('program.event_count', 'program.events')
      .getOne();

    if (!program) {
      return { status: 'error', message: 'Program does not exist' };
    }

    const eventCount = (program as any).event_count ?? 0;

    if (eventCount > 0) {
      return {
        status: 'error',
        message: `Program tidak dapat dihapus karena digunakan oleh ${eventCount} event`,
      };
    }

    await this.programsRepository.delete(id);

    return {
      status: 'success',
      message: 'Program deleted successfully!',
    };
  }
}
