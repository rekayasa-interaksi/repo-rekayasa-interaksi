import { BadRequestException, Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { ProgramAlumniDto } from './dto/program-alumni.dto';
import { validate } from 'class-validator';
import { ProgramAlumni } from './entities/program-alumni.entity';
import { QueryGetAllDto } from 'src/users/dto/query-get-all.dto';

@Injectable()
export class ProgramsAlumniService {
  constructor(
    private readonly loggerService: LoggerService,
    @InjectRepository(ProgramAlumni) private programAlumniRepository: Repository<ProgramAlumni>,
  ) {}

  async createProgramAlumni(programAlumniDto: ProgramAlumniDto) {
    await validate(programAlumniDto).then((errors) => {
      if (errors.length > 0) {
        this.loggerService.debug(`${errors}`, ProgramAlumniDto.name);
      }
    });

    const existing = await this.programAlumniRepository.findOne({
      where: {
        name: Raw(alias => `LOWER(${alias}) = LOWER(:name)`, {
          name: programAlumniDto.name
        })
      }
    });

    if (existing) {
      throw new BadRequestException("Data Chapter already exist!");
    }

    await this.programAlumniRepository.save({ ...programAlumniDto, created_at: new Date() });

    return { status: 'success', message: 'Program Alumni created successfully!' };
  }

  async getAllProgramAlumni(queryDto: QueryGetAllDto) {
    const { page, limit, query } = queryDto;

    const qb = this.programAlumniRepository
      .createQueryBuilder('programAlumni')
      .loadRelationCountAndMap(
        'programAlumni.user_count',
        'programAlumni.users'
      );

    if (query) {
      qb.where('LOWER(programAlumni.name) LIKE LOWER(:query)', {
        query: `%${query.toLowerCase()}%`,
      });
    }

    if (!page || !limit) {
      const data = await qb.getMany();

      return {
        status: 'success',
        message: 'Program Alumni get successfully!',
        data,
      };
    }

    qb.take(Number(limit));
    qb.skip((Number(page) - 1) * Number(limit));

    const [data, count] = await qb.getManyAndCount();

    const metaData = {
      page: Number(page),
      limit: Number(limit),
      totalData: count,
      totalPage: Math.ceil(count / Number(limit)),
    };

    return {
      status: 'success',
      message: 'Program Alumni get successfully!',
      data,
      metaData,
    };
  }

  async getOneProgramAlumni(id: string) {
    const data = await this.programAlumniRepository.findOne({ where: { id } });
    if (!data) {
      return { status: 'error', message: 'Program Alumni does not exist' };
    }

    return { status: 'success', message: 'Program Alumni updated successfully!', data };
  }

  async updateProgramAlumni(id: string, programAlumniDto: ProgramAlumniDto) {
    const errors = await validate(programAlumniDto);
    if (errors.length > 0) {
      this.loggerService.debug(`${errors}`, ProgramAlumniDto.name);
      throw new Error('Validation failed');
    }

    const existingClub = await this.programAlumniRepository.findOne({ where: { id } });
    if (!existingClub) {
      return { status: 'error', message: 'Program Alumni does not exist' };
    }

    await this.programAlumniRepository.update(id, {
      ...programAlumniDto,
      updated_at: new Date(),
    });

    return { status: 'success', message: 'Program Alumni updated successfully!' };
  }

  async deleteProgramAlumni(id: string) {
    const program = await this.programAlumniRepository
      .createQueryBuilder('program')
      .where('program.id = :id', { id })
      .loadRelationCountAndMap('program.user_count', 'program.users')
      .getOne();

    if (!program) {
      return { status: 'error', message: 'Program Alumni does not exist' };
    }

    const userCount = (program as any).user_count ?? 0;

    if (userCount > 0) {
      return {
        status: 'error',
        message: `Program Alumni tidak dapat dihapus karena digunakan oleh ${userCount} user`,
      };
    }

    await this.programAlumniRepository.delete(id);

    return {
      status: 'success',
      message: 'Program Alumni deleted successfully!',
    };
  }
}
