import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Raw, Repository } from 'typeorm';
import { StudentCampusDto } from './dto/student-campus.dto';
import { validate } from 'class-validator';
import { StudentCampus } from './entities/student-campus.entity';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { QueryGetAllDto } from 'src/users/dto/query-get-all.dto';
import { CommonOpenApi } from 'src/helpers/common';


@Injectable()
export class StudentCampusService {
  constructor(
    private readonly loggerService: LoggerService,
    @InjectRepository(StudentCampus) private studentCampusRepository: Repository<StudentCampus>,
  ) { }

  async createStudentCampus(studentCampusDto: StudentCampusDto) {
    await validate(studentCampusDto).then((errors) => {
      if (errors.length > 0) {
        this.loggerService.debug(`${errors}`, StudentCampusDto.name);
      }
    });
    const existing = await this.studentCampusRepository.findOne({
      where: {
        institute: Raw(alias => `LOWER(${alias}) = LOWER(:institute)`, {
          institute: studentCampusDto.institute
        })
      }
    });

    if (existing) {
      throw new BadRequestException("Data Campus already exist!");
    }

    await this.studentCampusRepository.save({ ...studentCampusDto, created_at: new Date() });

    return { status: 'success', message: 'Student Campus created successfully!' };
  }

  async getAllStudentCampus(queryDto: QueryGetAllDto) {
    const { page, limit, query } = queryDto;

    const qb = this.studentCampusRepository
      .createQueryBuilder('studentCampus')
      .loadRelationCountAndMap('studentCampus.user_count', 'studentCampus.users');

    if (query) {
      qb.where('LOWER(studentCampus.institute) LIKE LOWER(:query)', {
        query: `%${query.toLowerCase()}%`,
      });
    }

    if (!page || !limit) {
      const data = await qb.getMany();
      return {
        status: 'success',
        message: 'Student Campus get successfully!',
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
      message: 'Student Campus get successfully!',
      data,
      metaData,
    };
  }

  async getOneStudentCampus(id: string) {
    const data = await this.studentCampusRepository.findOne({ where: { id } });
    if (!data) {
      return { status: 'error', message: 'Student Campus does not exist' };
    }

    return { status: 'success', message: 'Student Campus found successfully!', data };
  }

  async updateStudentCampus(id: string, studentCampusDto: StudentCampusDto) {
    const errors = await validate(studentCampusDto);
    if (errors.length > 0) {
      this.loggerService.debug(`${errors}`, StudentCampusDto.name);
      throw new BadRequestException('Validation failed');
    }

    const existing = await this.studentCampusRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Student Campus does not exist');
    }

    try {
      await this.studentCampusRepository.update(id, {
        ...studentCampusDto,
        updated_at: new Date(),
      });
    } catch (err) {
      this.loggerService.error(err.message, err.stack, StudentCampusService.name);
      throw new InternalServerErrorException('Failed to update Student Campus');
    }

    return { status: 'success', message: 'Student Campus updated successfully!' };
  }

  async deleteStudentCampus(id: string) {
    const campus = await this.studentCampusRepository
      .createQueryBuilder('campus')
      .where('campus.id = :id', { id })
      .loadRelationCountAndMap('campus.user_count', 'campus.users')
      .getOne();

    if (!campus) {
      return { status: 'error', message: 'Student Campus does not exist' };
    }

    const userCount = (campus as any).user_count ?? 0;

    if (userCount > 0) {
      return {
        status: 'error',
        message: `Student Campus tidak dapat dihapus karena digunakan oleh ${userCount} user`,
      };
    }

    await this.studentCampusRepository.delete(id);

    return {
      status: 'success',
      message: 'Student Campus deleted successfully!',
    };
  }
}
