import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';
import { Faq } from './entities/faq.entity';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { Event } from '../events/entities/event.entity';
import { QueryDto } from '../events/dto/query.dto';
import { AnswerFaqDto } from './dto/answer-faq.dto';
import { QueryFaqDto } from './dto/query-faq.dto';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
  ) {}

  async findAll(queryDto: QueryFaqDto) {
    const { page = 1, limit = 10, query, show, menu }  = queryDto;
    let where: FindOptionsWhere<Faq> = {};

    if (menu) {
      where.menu = menu
    }
    
    if (query) {
      where.question = ILike(`%${query}%`);
    }

    if (show != undefined) {
      where.show = show
    } else {
      where.show = true;
    }

    const [data, count] = await this.faqRepository.findAndCount({
      where,
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    });

    const metaData = {
      page: Number(page),
      limit: Number(limit),
      totalData: count,
      totalPage: Math.ceil(count / Number(limit)),
    }

    return {
      status: 'success', message: 'Faq retrieved successfully!', data, metaData
    };
  }

  async findOne(id: string): Promise<Faq> {
    const faq = await this.faqRepository.findOne({ where: { id } });
    if (!faq) throw new NotFoundException('FAQ not found');
    return faq;
  }

  async create(dto: CreateFaqDto): Promise<Faq> {
    const faq = this.faqRepository.create(dto);
    return this.faqRepository.save(faq);
  }

  async answerQuestion(id: string, dto: AnswerFaqDto): Promise<Faq> {
    await this.faqRepository.update(id, dto);
    return this.findOne(id);
  }

  async update(id: string, dto: UpdateFaqDto): Promise<Faq> {
    await this.faqRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.faqRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('FAQ not found');
    return { message: 'FAQ deleted successfully' };
  }
}
