import { BadRequestException, Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { StudentChapterDto } from './dto/student-chapter.dto';
import { validate } from 'class-validator';
import { StudentChapter } from './entities/student-chapters.entity';
import { UploadsService } from '../uploads/uploads.service';
import { UserPayloadDto } from '../users/dto/user-payload.dto';
import * as dotenv from 'dotenv';
import { QueryGetAllDto } from 'src/users/dto/query-get-all.dto';

dotenv.config();

@Injectable()
export class StudentChaptersService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly uploadsService: UploadsService,
    @InjectRepository(StudentChapter) private studentChapterRepository: Repository<StudentChapter>,
  ) {}

  async createStudentChapter(userPayload: UserPayloadDto, studentChapterDto: StudentChapterDto, files: {
    image?: Express.Multer.File[],
  }) {
    const existing = await this.studentChapterRepository.findOne({
      where: {
        institute: Raw(alias => `LOWER(${alias}) = LOWER(:institute)`, {
          institute: studentChapterDto.institute
        })
      }
    });

    if (existing) {
      throw new BadRequestException("Data Chapter already exist!");
    }
    const fileData = await this.uploadsService.saveFileData(files, 'chapters');

    const chapters = await this.studentChapterRepository.create({ ...studentChapterDto, created_at: new Date(), created_by: userPayload.sub });

    if (fileData?.image) chapters.image_path = fileData.image

    await this.studentChapterRepository.save(chapters);

    return { status: 'success', message: 'Student Chapter created successfully!' };
  }

  async getAllStudentChapter(queryDto: QueryGetAllDto) {
    const { page, limit, query } = queryDto;

    const qb = this.studentChapterRepository
      .createQueryBuilder('studentChapter')
      .loadRelationCountAndMap('studentChapter.event_count', 'studentChapter.events')
      .loadRelationCountAndMap('studentChapter.user_count', 'studentChapter.users');  

    if (query) {
      qb.where('LOWER(studentChapter.institute) LIKE LOWER(:query)', {
        query: `%${query.toLowerCase()}%`,
      });
    }

    if (!page || !limit) {
      const data = await qb.getMany();
      return {
        status: 'success',
        message: 'Student Chapter get successfully!',
        data: data.map(ch => ({
          ...ch,
          image_url: ch.image_path
            ? process.env.BASE_URL_STORAGE + ch.image_path
            : null,
        })),
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
      message: 'Student Chapter get successfully!',
      data: data.map(ch => ({
        ...ch,
        image_url: ch.image_path
          ? process.env.BASE_URL_STORAGE + ch.image_path
          : null,
      })),
      metaData,
    };
  }

  async getOneStudentChapter(id: string) {
    const data = await this.studentChapterRepository.findOne({
      where: { id },
      relations: [
        'leader',
        'leader.student_club',
        'leader.student_chapter',
        'leader.social_media',
      ],
    });

    if (!data) {
      return { status: 'error', message: 'Student Chapter does not exist' };
    }

    return { status: 'success', message: 'Student Chapter retrieved successfully!', data };
  }

  async updateStudentChapter(
    id: string,
    studentChapterDto: StudentChapterDto,
    files: { image?: Express.Multer.File[] }
  ) {
    const existingClub = await this.studentChapterRepository.findOne({ where: { id } });
    if (!existingClub) {
      return { status: 'error', message: 'Student Chapter does not exist' };
    }

    if (files?.image?.[0]) {
      if (existingClub.image_path) {
        await this.uploadsService.deleteFileData(existingClub.image_path)
      }

      const newImage = await this.uploadsService.saveSingleFile(files.image[0], 'chapters')
      existingClub.image_path = newImage.image
    }

    Object.assign(existingClub, studentChapterDto)
    const updatedData = await this.studentChapterRepository.save({ ...existingClub, updated_at: new Date()})

    return { status: 'success', message: 'Student Chapter updated successfully!', data: updatedData };
  }

  async deleteStudentChapter(id: string) {
    const chapter = await this.studentChapterRepository
      .createQueryBuilder('chapter')
      .where('chapter.id = :id', { id })
      .loadRelationCountAndMap('chapter.event_count', 'chapter.events')
      .loadRelationCountAndMap('chapter.user_count', 'chapter.users')
      .getOne();

    if (!chapter) {
      return { status: 'error', message: 'Student Chapter does not exist' };
    }

    const userCount = (chapter as any).user_count ?? 0;
    const eventCount = (chapter as any).event_count ?? 0;

    if (userCount > 0 && eventCount > 0) {
      return {
        status: 'error',
        message: `Student Chapter tidak dapat dihapus karena digunakan oleh ${userCount} user dan ${eventCount} event`,
      };
    }

    await this.uploadsService.deleteFileData(chapter.image_path);

    await this.studentChapterRepository.delete(id);

    return {
      status: 'success',
      message: 'Student Chapter deleted successfully!',
    };
  }
}
