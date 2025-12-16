import { BadRequestException, Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { StudentClub } from './entities/student-club.entity';
import { StudentClubDto } from './dto/student-club.dto';
import { validate } from 'class-validator';
import { UploadsService } from '../uploads/uploads.service';
import { UserPayloadDto } from '../users/dto/user-payload.dto';
import * as dotenv from 'dotenv';
import { QueryGetAllDto } from 'src/users/dto/query-get-all.dto';

dotenv.config();

@Injectable()
export class StudentClubsService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly uploadsService: UploadsService,
    @InjectRepository(StudentClub) private studentClubRepository: Repository<StudentClub>,
  ) {}

  async createStudentClub(userPayload: UserPayloadDto, studentClubDto: StudentClubDto, files: {
    image?: Express.Multer.File[], logo?: Express.Multer.File[]
  }) {
    const existing = await this.studentClubRepository.findOne({
      where: {
        name: Raw(alias => `LOWER(${alias}) = LOWER(:name)`, {
          name: studentClubDto.name
        })
      }
    });

    if (existing) {
      throw new BadRequestException("Data Club already exist!");
    }
    const clubs = await this.studentClubRepository.create({ ...studentClubDto, created_at: new Date(), created_by: userPayload.sub });

    if (files.image?.[0]) {
      const imageData = await this.uploadsService.saveSingleFile(files.image[0], 'clubs');
      clubs.image_path = imageData.image;
    }

    if (files.logo?.[0]) {
      const logoData = await this.uploadsService.saveSingleFile(files.logo[0], 'logos');
      clubs.logo_path = logoData.image;
    }

    await this.studentClubRepository.save(clubs);

    return { status: 'success', message: 'Student Club created successfully!' };
  }

  async getAllStudentClub(queryDto: QueryGetAllDto) {
    const { page = 1, limit = 10, query } = queryDto;

    const qb = this.studentClubRepository
      .createQueryBuilder('club')
      .loadRelationCountAndMap(
        'club.event_count',
        'club.events'
      );

    if (query) {
      qb.where('LOWER(club.name) LIKE LOWER(:query)', {
        query: `%${query.toLowerCase()}%`,
      });
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
      message: 'Student Club get successfully!',
      data: data.map(club => ({
        ...club,
        image_url: club.image_path
          ? process.env.BASE_URL_STORAGE + club.image_path
          : null,
        logo_url: club.logo_path
          ? process.env.BASE_URL_STORAGE + club.logo_path
          : null,
      })),
      metaData,
    };
  }

  async getOneStudentClub(id: string) {
    const data = await this.studentClubRepository.findOne({ where: { id } });
    if (!data) {
      return { status: 'error', message: 'Student Club does not exist' };
    }

    return { status: 'success', message: 'Student Club Get One successfully!', data };
  }

  async updateStudentClub(
    id: string,
    studentClubDto: StudentClubDto,
    files: { image?: Express.Multer.File[], logo?: Express.Multer.File[] }
  ) {
    const existingClub = await this.studentClubRepository.findOne({ where: { id } });
    if (!existingClub) {
      return { status: 'error', message: 'Student Club does not exist' };
    }

    if (files.image?.[0]) {
      if (existingClub.image_path) {
        await this.uploadsService.deleteFileData(existingClub.image_path);
      }
      const imageData = await this.uploadsService.saveSingleFile(files.image[0], 'clubs');
      existingClub.image_path = imageData.image;
    }

    if (files.logo?.[0]) {
      if (existingClub.logo_path) {
        await this.uploadsService.deleteFileData(existingClub.logo_path);
      }
      const logoData = await this.uploadsService.saveSingleFile(files.logo[0], 'logos');
      existingClub.logo_path = logoData.image;
    }

    Object.assign(existingClub, studentClubDto, { updated_at: new Date() });

    await this.studentClubRepository.save(existingClub);

    return { status: 'success', message: 'Student Club updated successfully!' };
  }


  async deleteStudentClub(id: string) {
    const club = await this.studentClubRepository
      .createQueryBuilder('club')
      .where('club.id = :id', { id })
      .loadRelationCountAndMap(
        'club.event_count',
        'club.events'
      )
      .getOne();

    if (!club) {
      return { status: 'error', message: 'Student Club does not exist' };
    }

    const eventCount = (club as any).event_count ?? 0;

    if (eventCount > 0) {
      return {
        status: 'error',
        message: `Student Club tidak dapat dihapus karena digunakan oleh ${eventCount} event`,
      };
    }

    if (club.image_path) {
      await this.uploadsService.deleteFileData(club.image_path);
    }

    if (club.logo_path) {
      await this.uploadsService.deleteFileData(club.logo_path);
    }

    await this.studentClubRepository.delete(id);

    return {
      status: 'success',
      message: 'Student Club deleted successfully!',
    };
  }
}
