import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Raw, Repository } from 'typeorm';
import { ExternalOrganization } from './entities/external-organization.entity';
import { CreateExternalDto } from './dto/create-external-organization.dto';
import { UpdateExternalDto } from './dto/update-external-organization.dto';
import { UploadsService } from '../uploads/uploads.service';
import { UserPayloadDto } from '../users/dto/user-payload.dto';
import * as dotenv from 'dotenv';
import { QueryDto } from 'src/events/dto/query.dto';

dotenv.config();

@Injectable()
export class ExternalOrganizationService {
  constructor(
    private readonly uploadsService: UploadsService,
    @InjectRepository(ExternalOrganization)
    private readonly externalOrganizationRepository: Repository<ExternalOrganization>,
  ) {}

  async createExternalOrganization(
    userPayload: UserPayloadDto,
    createExternalDto: CreateExternalDto,
    files: { image?: Express.Multer.File[] },
  ) {
    const existing = await this.externalOrganizationRepository.findOne({
      where: {
        name: Raw(alias => `LOWER(${alias}) = LOWER(:name)`, {
          name: createExternalDto.name
        })
      }
    });

    if (existing) {
      throw new BadRequestException("Data External Organization already exist!");
    }
    const fileData = await this.uploadsService.saveFileData(files, 'external_organizations');

    const newExternalOrganization = this.externalOrganizationRepository.create({
      ...createExternalDto,
      created_at: new Date(),
      created_by: userPayload.sub,
    });

    if (fileData?.image) {
      newExternalOrganization.image_path = fileData.image;
    }

    await this.externalOrganizationRepository.save(newExternalOrganization);

    return { status: 'success', message: 'External Organization created successfully!' };
  }

  async getAllExternalOrganizations(queryDto: QueryDto) {
    const { page, limit, query } = queryDto;

    const qb = this.externalOrganizationRepository
      .createQueryBuilder('externalOrg')
      .loadRelationCountAndMap(
        'externalOrg.event_count',
        'externalOrg.events'
      );

    if (query) {
      qb.where('LOWER(externalOrg.name) LIKE LOWER(:query)', {
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
      message: 'External Organizations retrieved successfully!',
      data: data.map(org => ({
        ...org,
        image_url: org.image_path
          ? `${process.env.BASE_URL_STORAGE}${org.image_path}`
          : null,
      })),
      metaData,
    };
  }

  async getExternalOrganizationById(id: string) {
    const data = await this.externalOrganizationRepository.findOne({ where: { id } });
    if (!data) {
      return { status: 'error', message: 'External Organization does not exist' };
    }

    return { status: 'success', message: 'External Organization found successfully!', data };
  }

  async updateExternalOrganization(
    id: string,
    updateExternalOrganizationDto: UpdateExternalDto,
    files: { image?: Express.Multer.File[] },
  ) {
    const externalData = await this.externalOrganizationRepository.findOne({ where: { id } });
    if (!externalData) {
      throw new NotFoundException('External Organization does not exist');
    }

    if (files?.image?.[0]) {
      if (externalData.image_path) {
        await this.uploadsService.deleteFileData(externalData.image_path);
      }

      const newImage = await this.uploadsService.saveSingleFile(files.image[0], 'external_organizations');
      externalData.image_path = newImage.image;
    }

    Object.assign(externalData, updateExternalOrganizationDto);
    try {
      await this.externalOrganizationRepository.save(externalData);
    } catch (err) {
      throw new InternalServerErrorException('Failed to update External Organization');
    }

    return { status: 'success', message: 'External Organization updated successfully!' };
  }

  async deleteExternalOrganization(id: string) {
    const externalOrg = await this.externalOrganizationRepository
      .createQueryBuilder('externalOrg')
      .where('externalOrg.id = :id', { id })
      .loadRelationCountAndMap(
        'externalOrg.event_count',
        'externalOrg.events'
      )
      .getOne();

    if (!externalOrg) {
      return { status: 'error', message: 'External Organization does not exist' };
    }

    const eventCount = (externalOrg as any).event_count ?? 0;

    if (eventCount > 0) {
      return {
        status: 'error',
        message: `External Organization tidak dapat dihapus karena digunakan oleh ${eventCount} event`,
      };
    }

    if (externalOrg.image_path) {
      await this.uploadsService.deleteFileData(externalOrg.image_path);
    }

    await this.externalOrganizationRepository.delete(id);

    return {
      status: 'success',
      message: 'External Organization deleted successfully!',
    };
  }
}
