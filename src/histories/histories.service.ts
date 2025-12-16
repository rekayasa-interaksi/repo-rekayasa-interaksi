import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Raw, Repository } from 'typeorm';
import { Histories } from './entities/histories.entity';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { UserPayloadDto } from '../users/dto/user-payload.dto';
import { UploadsService } from '../uploads/uploads.service';
import { QueryHistoryDto } from './dto/query-history.dto';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class HistoriesService {
  constructor(
    private readonly uploadsService: UploadsService,
    @InjectRepository(Histories)
    private readonly historiesRepository: Repository<Histories>,
  ) {}

  async create(
    userPayload: UserPayloadDto,
    dto: CreateHistoryDto,
    files: {
      image?: Express.Multer.File[],
  }) {
    const fileData = await this.uploadsService.saveFileData(files, 'histories');

    const year = dto.date?.split('-')[0];

    const data = this.historiesRepository.create({ ...dto, created_at: new Date(), created_by: userPayload.sub});

    if (fileData?.image) data.image_path = fileData.image

    const storedData = await this.historiesRepository.save(data);

    return { status: 'success', message: 'Histories Success Created', data: storedData };
  }

  async findAll(queryDto: QueryHistoryDto) {
    const { page, limit, year, group, query } = queryDto;
    let where: FindOptionsWhere<Histories> = {}
    let histories: Histories[]
    let totalData: any
    let metaData: any

    const mapHistory = (h: any) => ({
      ...h,
      image_url: h.image_path ? process.env.BASE_URL_STORAGE + h.image_path : null,
    });

    if (query) {
      where.title = ILike(`%${query}%`)
    }
    if (year) {
      where.date = Raw((alias) => `EXTRACT(YEAR FROM ${alias}) = ${Number(year)}`);
    }

    if (page && limit) {
      [histories, totalData] = await this.historiesRepository.findAndCount({
        where,
        take: Number(limit),
        skip: (Number(page) - 1) * Number(limit),
        order: { date: 'DESC' },
      });

      metaData = {
        page: Number(page),
        limit: Number(limit),
        totalData,
        totalPage: Math.ceil(totalData / Number(limit)),
      };
    } else {
      [histories, totalData] = await this.historiesRepository.findAndCount({
        where,
        order: { date: 'DESC' },
      });
    }

    if (group === 'year' || group === 'month') {
      if (group === 'year') {
        const grouped = histories.reduce((acc, h) => {
          const year = new Date(h.date).getFullYear();
          if (!acc[year]) acc[year] = [];
          acc[year].push(mapHistory(h));
          return acc;
        }, {} as Record<number, any[]>);

        const data = Object.entries(grouped)
          .map(([year, items]) => ({
            year: Number(year),
            total: items.length,
            histories: items,
          }))
          .sort((a, b) => b.year - a.year);

        if (page && limit) {
          return {
            status: 'success',
            message: 'Histories grouped by year retrieved successfully!',
            data,
            metaData
          };
        }  else {
          return {
            status: 'success',
            message: 'Histories grouped by year retrieved successfully!',
            data
          };
        }
      }

      if (group === 'month') {
        const grouped = histories.reduce((acc, h) => {
          const date = new Date(h.date);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const key = `${year}-${month}`;

          if (!acc[key]) acc[key] = [];
          acc[key].push(mapHistory(h));
          return acc;
        }, {} as Record<string, any[]>);

        const data = Object.entries(grouped)
          .map(([key, items]) => {
            const [year, month] = key.split('-').map(Number);
            return { year, month, total: items.length, histories: items };
          })
          .sort((a, b) => b.year - a.year || b.month - a.month);

        if (page && limit) {
          return {
            status: 'success',
            message: 'Histories grouped by month retrieved successfully!',
            data,
            metaData
          };
        }  else {
          return {
            status: 'success',
            message: 'Histories grouped by month retrieved successfully!',
            data
          };
        }
      }
    }

    if (page && limit) {
      return {
        status: 'success',
        message: 'Histories retrieved successfully!',
        data: histories.map(mapHistory),
        metaData
      };
    }  else {
      return {
        status: 'success',
        message: 'Histories retrieved successfully!',
        data: histories.map(mapHistory)
      };
    }
  }

  async findOne(id: string) {
    const item = await this.historiesRepository.findOne({
      where: { id }
    });
    if (!item) throw new NotFoundException(`Histories Not Found`);
    return { status: 'success', message: 'Histories found!', data: item };
  }

  async update(
    id: string,
    dto: UpdateHistoryDto,
    files: { image?: Express.Multer.File[] }
  ) {
    const item = await this.historiesRepository.findOne({ where: { id } });
    if (files?.image?.[0]) {
      if (item.image_path) {
        await this.uploadsService.deleteFileData(item.image_path)
      }

      const newImage = await this.uploadsService.saveSingleFile(files.image[0], 'histories');
      item.image_path = newImage.image
    }

    Object.assign(item, dto);
    const updatedData = await this.historiesRepository.save(item);

    return  { status: 'success', message: 'Histories updated!', data: updatedData };
  }

  async remove(id: string) {
    const existingItem = await this.historiesRepository.findOne({ where: { id } });
    if (!existingItem) {
      throw new NotFoundException(`Histories Not Found`);
    }
    await this.uploadsService.deleteFileData(existingItem.image_path);

    await this.historiesRepository.delete(id);

    return { status: 'success', message: 'Histories removed!' };
  }
}
