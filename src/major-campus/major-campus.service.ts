import { BadRequestException, Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Like, Raw, Repository } from 'typeorm';
import { MajorCampusDto } from './dto/major-campus.dto';
import { validate } from 'class-validator';
import { MajorCampus } from './entities/major-campus.entity';
import { QueryGetAllDto } from 'src/users/dto/query-get-all.dto';
import { CommonOpenApi } from 'src/helpers/common';

@Injectable()
export class MajorCampusService {
  constructor(
    private readonly loggerService: LoggerService,
    @InjectRepository(MajorCampus) private majorCampusRepository: Repository<MajorCampus>,
  ) {}

  async createMajorCampus(majorCampusDto: MajorCampusDto) {
    await validate(majorCampusDto).then((errors) => {
      if (errors.length > 0) {
        this.loggerService.debug(`${errors}`, MajorCampusDto.name);
      }
    });

    const existing = await this.majorCampusRepository.findOne({
      where: {
        major: Raw(alias => `LOWER(${alias}) = LOWER(:major)`, {
          major: majorCampusDto.major
        })
      }
    });

    if (existing) {
      throw new BadRequestException("Data Major already exist!");
    }

    await this.majorCampusRepository.save({
      ...majorCampusDto,
      created_at: new Date(),
    });

    return {
      status: 'success',
      message: 'Major Campus created successfully!'
    };
  }

  async getAllMajorCampus(queryDto: QueryGetAllDto) {
    const { page, limit, query } = queryDto;

    const qb = this.majorCampusRepository
      .createQueryBuilder('majorCampus')
      .leftJoin('majorCampus.users', 'users')
      .loadRelationCountAndMap('majorCampus.user_count', 'majorCampus.users');

    if (query) {
      qb.where('LOWER(majorCampus.major) LIKE LOWER(:query)', {
        query: `%${query.toLowerCase()}%`,
      });
    }

    if (!page || !limit) {
      const data = await qb.getMany();
      return { status: 'success', message: 'Major Campus get successfully!', data };
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

    return { status: 'success', message: 'Major Campus get successfully!', data, metaData };
  }

  async getOneMajorCampus(id: string) {
    const data = await this.majorCampusRepository.findOne({ where: { id } });
    if (!data) {
      return { status: 'error', message: 'Major Campus does not exist' };
    }

    return { status: 'success', message: 'Major Campus retrieved successfully!', data };
  }

  async updateMajorCampus(id: string, majorCampusDto: MajorCampusDto) {
    const errors = await validate(majorCampusDto);
    if (errors.length > 0) {
      this.loggerService.debug(`${errors}`, MajorCampusDto.name);
      throw new Error('Validation failed');
    }

    const existingClub = await this.majorCampusRepository.findOne({ where: { id } });
    if (!existingClub) {
      return { status: 'error', message: 'Major Campus does not exist' };
    }

    await this.majorCampusRepository.update(id, {
      ...majorCampusDto,
      updated_at: new Date(),
    });

    return { status: 'success', message: 'Major Campus updated successfully!' };
  }

  async deleteMajorCampus(id: string) {
    const majorCampus = await this.majorCampusRepository
      .createQueryBuilder('majorCampus')
      .where('majorCampus.id = :id', { id })
      .loadRelationCountAndMap('majorCampus.user_count', 'majorCampus.users')
      .getOne();

    if (!majorCampus) {
      return { status: 'error', message: 'Major Campus does not exist' };
    }

    const userCount = (majorCampus as any).user_count ?? 0;

    if (userCount > 0) {
      return {
        status: 'error',
        message: `Major Campus tidak dapat dihapus karena digunakan oleh ${userCount} user`,
      };
    }

    await this.majorCampusRepository.delete(id);

    return {
      status: 'success',
      message: 'Major Campus deleted successfully!',
    };
  }
}
