import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { validate as isValidUUID } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { Roles } from '../roles/entities/roles.entity';
import { UserPayloadDto } from 'src/users/dto/user-payload.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
  ) {}

  async createAdmin(registerAdminDto: RegisterAdminDto, userPayload: UserPayloadDto): Promise<Admin> {
    const { email, password, role_id, status } = registerAdminDto;

    if (!isValidUUID(role_id)) {
      throw new BadRequestException('Invalid role_id. Must be a valid UUID.');
    }

    const role = await this.roleRepository.findOne({ where: { id: role_id } });
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    const adminExist = await this.adminRepository.findOne({ where: { email } });
    if (adminExist) {
      throw new BadRequestException('Admin already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = this.adminRepository.create({
      email,
      password: hashedPassword,
      role: role,
      status,
      created_at: new Date(),
      created_by: userPayload.sub,
      updated_at: new Date(),
    });

    return this.adminRepository.save(admin);  
  }

  async findAdminByEmail(email: string): Promise<Admin | undefined> {
    return this.adminRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }
}
