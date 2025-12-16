import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { RolesDto } from './dto/roles.dto';
import { validate } from 'class-validator';
import { Roles } from './entities/roles.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RolesService {
  constructor(
    private readonly loggerService: LoggerService,
    @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
  ) {}

  async createRoles(rolesDto: RolesDto) {
    await validate(rolesDto).then((errors) => {
      if (errors.length > 0) {
        this.loggerService.debug(`${errors}`, RolesDto.name);
      }
    });

    await this.rolesRepository.save({ ...rolesDto, created_at: new Date() });

    return { status: 'success', message: 'Roles created successfully!' };
  }

  async getAllRoles() {
    const data = await this.rolesRepository.find({ where: {name: Not(In(['superadmin', 'admin']))} });

    return { status: 'success', message: 'Roles get successfully!', data };
  }

  async getOneRoles(id: string) {
    const data = await this.rolesRepository.findOne({ where: { id } });
    if (!data) {
      return { status: 'error', message: 'Roles does not exist' };
    }

    return { status: 'success', message: 'Roles updated successfully!', data };
  }

  async updateRoles(id: string, rolesDto: RolesDto) {
    const errors = await validate(rolesDto);
    if (errors.length > 0) {
      this.loggerService.debug(`${errors}`, RolesDto.name);
      throw new Error('Validation failed');
    }

    const existingClub = await this.rolesRepository.findOne({ where: { id } });
    if (!existingClub) {
      return { status: 'error', message: 'Roles does not exist' };
    }

    await this.rolesRepository.update(id, {
      ...rolesDto
    });

    return { status: 'success', message: 'Roles updated successfully!' };
  }

  async deleteRoles(id: string) {
    const existingClub = await this.rolesRepository.findOne({ where: { id } });
    if (!existingClub) {
      return { status: 'error', message: 'Roles does not exist' };
    }

    await this.rolesRepository.delete(id);

    return { status: 'success', message: 'Roles updated successfully!' };
  }
}
