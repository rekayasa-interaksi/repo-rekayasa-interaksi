import { BadRequestException, Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { HelpCenterDto } from './dto/help-centers.dto';
import { validate } from 'class-validator';
import { HelpCenter } from './entities/help-centers.entity';
import { QueryHelpCenterDto } from './dto/query.dto';
import { Users } from 'src/users/entities/users.entitiy';
import { UserPayloadDto } from 'src/users/dto/user-payload.dto';
import { AnswerDto } from './dto/answer.dto';

@Injectable()
export class HelpCentersService {
  constructor(
    private readonly loggerService: LoggerService,
    @InjectRepository(HelpCenter) private helpCenterRepository: Repository<HelpCenter>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async createHelpCenter(userPayload: UserPayloadDto, helpCenterDto: HelpCenterDto) {
    let user: Users;

    await validate(helpCenterDto).then((errors) => {
      if (errors.length > 0) {
        this.loggerService.debug(`${errors}`, HelpCenterDto.name);
      }
    });

    if (!userPayload || !userPayload.sub) {
      if (!helpCenterDto.email) {
        throw new BadRequestException('Email is required for unauthenticated users');
      }
    } else {
      user = await this.usersRepository.findOne({ where: { id: userPayload.sub } });
      helpCenterDto.email = user.email;
    }

    await this.helpCenterRepository.save({ ...helpCenterDto, created_at: new Date(), created_by: user ? user.id : helpCenterDto.email });

    return { status: 'success', message: 'Help Center created successfully!' };
  }

  async getAllHelpCenters(queryDto: QueryHelpCenterDto) {
    const { page=1, limit=10, query, status } = queryDto;
    let where: FindOptionsWhere<HelpCenter> = {};

    if (query) where.question = ILike(`%${query}%`);

    if (status !== undefined) {
      if (status === 'true') where.status = true;
      else if (status === 'false') where.status = false;
    }

    const [data, count] = await this.helpCenterRepository.findAndCount({
      where,
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    });

    const metaData = {
      page: Number(page),
      limit: Number(limit),
      totalData: count,
      totalPage: Math.ceil(count / Number(limit)),
    };

    return { status: 'success', message: 'Help Center get successfully!', data, metaData };
  }

  async updateHelpCenter(id: string, status: boolean, answerDto: AnswerDto, userPayload: UserPayloadDto) {
    await this.helpCenterRepository.update(id, { status, answer: answerDto.answer, updated_at: new Date(), updated_by: userPayload.sub });

    return { status: 'success', message: 'Help Center updated successfully!' };
  }
}
