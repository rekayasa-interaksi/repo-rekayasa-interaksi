import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { OrganizationalStructure } from './entities/organizational-structure.entity';
import { CreateOrganizationalStructureDto } from './dto/create-org-structure.dto';
import { UpdateOrganizationalStructureDto } from './dto/update-org-structure.dto';
import { UserPayloadDto } from '../users/dto/user-payload.dto';
import { UploadsService } from '../uploads/uploads.service';
import { SocialMedia } from 'src/social-media/entities/social-media.entity';
import { StudentClub } from 'src/student-clubs/entities/student-club.entity';
import { StudentChapter } from 'src/student-chapters/entities/student-chapters.entity';
import * as dotenv from 'dotenv';
import { Users } from 'src/users/entities/users.entitiy';

dotenv.config();

@Injectable()
export class OrganizationalStructureService {
  constructor(
    private readonly uploadsService: UploadsService,
    @InjectRepository(OrganizationalStructure)
    private readonly orgRepo: Repository<OrganizationalStructure>,

    @InjectRepository(Users)
    private usersRepository: Repository<Users>,

    @InjectRepository(StudentClub)
    private studentClubRepository: Repository<StudentClub>,

    @InjectRepository(StudentChapter)
    private studentChapterRepository: Repository<StudentChapter>,
  ) {}

  async create(
    userPayload: UserPayloadDto,
    dto: CreateOrganizationalStructureDto,
    files: {
      image?: Express.Multer.File[],
  }) {
    const { user_id, ...orgData } = dto;
    let studentChapter: StudentChapter;
    let studentClub: StudentClub;
    let user: Users;
    const fileData = await this.uploadsService.saveFileData(files, 'organizational_structure');

    if (user_id) {
      user = await this.usersRepository.findOne({ where: { id: user_id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    if (orgData.student_chapter_id) {
      studentChapter = await this.studentChapterRepository.findOne({
        where: { id: orgData.student_chapter_id },
      });

      if (!studentChapter) {
        throw new NotFoundException('Student Chapter not found');
      }
    }

    if (orgData.student_club_id) {
      studentClub = await this.studentClubRepository.findOne({
        where: { id: orgData.student_club_id },
      });

      if (!studentClub) {
        throw new NotFoundException('Student Club not found');
      }
    }

    const data = this.orgRepo.create({ 
      ...dto, 
      student_chapter: studentChapter,
      student_club: studentClub,
      user: user,
      created_at: new Date(), 
      created_by: userPayload.sub
    });

    if (fileData?.image) data.image_path = fileData.image

    const storedData = await this.orgRepo.save(data);

    return { status: 'success', message: 'Organizational Structure Success Created', data: storedData };
  }

  async getGenerations() {
    const generations = await this.orgRepo
      .createQueryBuilder('organizational_structure')
      .select('DISTINCT organizational_structure.generation', 'generation')
      .where('organizational_structure.generation IS NOT NULL')
      .orderBy('organizational_structure.generation', 'ASC')
      .getRawMany();
      
    const generationList = generations.map(gen => gen.generation);
    
    return {
      message: 'Generations retrieved successfully',
      data: generationList,
    };
  }

  async findAll(generation?: string) {
    let where: FindOptionsWhere<OrganizationalStructure> = {};
    where.generation = generation || new Date().getFullYear().toString();

    const data = await this.orgRepo.find({
      where,
      relations: ['user', 'user.social_media', 'student_club', 'student_chapter'],
      order: { created_at: 'DESC' },
    });

    const formattedData = data.map(org => ({
      id: org.id,
      name: org.user?.name || null,
      image_path: org.image_path || null,
      student_club: org.student_club || null,
      student_chapter: org.student_chapter || null,
      type: org.type,
      generation: org.generation,
      position: org.position,
      created_at: org.created_at,
      created_by: org.created_by,
      updated_at: org.updated_at,
      updated_by: org.updated_by,
      image_url: org.image_path ? process.env.BASE_URL_STORAGE + org.image_path : null,
      social_media: org.user?.social_media || null,
    }));

    return {
      status: 'success',
      message: 'Organizational Structure get successfully!',
      data: formattedData,
    };
  }

  async findOne(id: string) {
    const item = await this.orgRepo.findOne({
      where: { id }
    });
    if (!item) throw new NotFoundException(`Organizational Structure Not Found`);
    return { status: 'success', message: 'Organizational Structure found!', data: item };
  }

  async update(
    id: string,
    dto: UpdateOrganizationalStructureDto,
    files: { image?: Express.Multer.File[] }
  ) {
    console.log('DTO', dto);
    let studentChapter: StudentChapter;
    let studentClub: StudentClub;
    let user: Users;

    if (dto.user_id) {
      user = await this.usersRepository.findOne({ where: { id: dto.user_id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    if (dto.student_chapter_id) {
      studentChapter = await this.studentChapterRepository.findOne({
        where: { id: dto.student_chapter_id },
      });
      
      if (!studentChapter) {
        throw new NotFoundException('Student Chapter not found');
      }
    }
    
    if (dto.student_club_id) {
      studentClub = await this.studentClubRepository.findOne({
        where: { id: dto.student_club_id },
      });
      
      if (!studentClub) {
        throw new NotFoundException('Student Club not found');
      }
    }

    const item = await this.orgRepo.findOne({ where: { id } });
    if (files?.image?.[0]) {
      if (item.image_path) {
        await this.uploadsService.deleteFileData(item.image_path)
      }

      const newImage = await this.uploadsService.saveSingleFile(files.image[0], 'organizational_structure')
      item.image_path = newImage.image
    }

    item.student_chapter = studentChapter
    item.student_club = studentClub
    item.user = user
    Object.assign(item, dto);
    const updatedData = await this.orgRepo.save(item);

    return  { status: 'success', message: 'Organizational Structure updated!', data: updatedData };
  }

  async remove(id: string) {
    const existingItem = await this.orgRepo.findOne({ where: { id } });
    if (!existingItem) {
      throw new NotFoundException(`Organizational Structure Not Found`);
    }
    await this.uploadsService.deleteFileData(existingItem.image_path);

    await this.orgRepo.delete(id);

    return { status: 'success', message: 'Organizational Structure removed!' };
  }
}
