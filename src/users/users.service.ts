import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, ILike, In, IsNull, Not, Raw, Repository } from 'typeorm';
import { Users } from 'src/users/entities/users.entitiy';
import { UserHelper as helper } from '../helpers/user.helper';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { QueryGetAllDto } from './dto/query-get-all.dto';
import { validate as isValidUUID, NIL } from 'uuid';
import { StudentCampus } from '../student-campus/entities/student-campus.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { SocialMedia } from '../social-media/entities/social-media.entity';
import { MajorCampus } from '../major-campus/entities/major-campus.entity';
import { Domisili } from './entities/domisili.entity';
import { QueryGetAllCommonDto } from './dto/query-get-all-common.dto';
import { ValidateMemberDto } from './dto/validate-member.dto';
import { StudentChapter } from 'src/student-chapters/entities/student-chapters.entity';
import { HeaderData } from 'src/helpers/email-verif.dto';
import TemplateHTML from 'src/helpers/template-html.helper';
import emailVerificationHelper from 'src/helpers/email-verification.helper';
import { EmailVerification } from './entities/email-verification.entity';
import { AccountInformationDto } from './dto/account-information.dto';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';
import { Roles } from 'src/roles/entities/roles.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadsService } from 'src/uploads/uploads.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserPayloadDto } from './dto/user-payload.dto';
import { LoggingRequestDto } from './dto/logging-request';
import { Logging } from './entities/logging.entity';
import { time } from 'console';
import { VerifyOtpDto } from './dto/email-verification.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { CommonOpenApi } from 'src/helpers/common';
import { StudentClub } from 'src/student-clubs/entities/student-club.entity';
import { ProgramAlumni } from 'src/programs-alumni/entities/program-alumni.entity';
import { DeleteImageDto } from './dto/delete-image-dto';
import { Event, StatusEvents } from 'src/events/entities/event.entity';
import { Programs } from 'src/programs/entities/programs.entity';
import { OrganizationalStructure } from 'src/organizational-structure/entities/organizational-structure.entity';
import { ParticipantDto } from 'src/helpers/dto/participant-dto';
import { validate } from 'class-validator';
import { DomisiliDto } from './dto/domisili.dto';
import { LoggerService } from 'src/logger/logger.service';

dotenv.config();

@Injectable()
export class UsersService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly loggerService: LoggerService,
    private readonly uploadsService: UploadsService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,

    @InjectRepository(StudentCampus)
    private studentCampusRepository: Repository<StudentCampus>,

    @InjectRepository(SocialMedia)
    private socialMediaRepository: Repository<SocialMedia>,

    @InjectRepository(MajorCampus)
    private majorCampusRepository: Repository<MajorCampus>,

    @InjectRepository(Domisili)
    private domisiliRepository: Repository<Domisili>,

    @InjectRepository(StudentChapter)
    private studentChapterRepository: Repository<StudentChapter>,

    @InjectRepository(EmailVerification)
    private emailVerificationRepository: Repository<EmailVerification>,

    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,

    @InjectRepository(Logging)
    private loggingRepository: Repository<Logging>,

    @InjectRepository(StudentClub)
    private studentClubRepository: Repository<StudentClub>,

    @InjectRepository(Event)
    private eventRepository: Repository<Event>,

    @InjectRepository(ProgramAlumni)
    private programAlumniRepository: Repository<ProgramAlumni>,

    @InjectRepository(Programs)
    private programRepository: Repository<Programs>,

    @InjectRepository(OrganizationalStructure)
    private organizationalStructureRepository: Repository<OrganizationalStructure>,
  ) {}

  async getAllUser(queryDto: QueryGetAllDto) {
    const { page = 1, limit = 10, query, domisili_id, campus_id, student_chapter_id, student_club_id, sort, role_id } = queryDto;
    let where: FindOptionsWhere<Users> = {};
    let order: Record<string, 'ASC' | 'DESC'> = {};
    let sorting = {}

    if (query) where.name = ILike(`%${query}%`);

    if (campus_id) where.student_campus = { id: campus_id };

    if (domisili_id) where.domisili = { id: domisili_id };

    if (student_chapter_id) where.student_chapter = { id: student_chapter_id };

    if (student_club_id) where.student_club = { id: student_club_id };

    if (role_id) where.role = { id: role_id };

    if (typeof sort === 'string') {
      sorting = JSON.parse(sort)
    } else {
      sorting = sort;
    }

    if (sorting && typeof sorting === 'object' && Object.keys(sorting).length > 0) {
      for (const [key, value] of Object.entries(sorting)) {
        if (typeof key === 'string' && (value === 0 || value === 1)) {
          order[key] = value === 0 ? 'ASC' : 'DESC';
        }
      }
    }

    if (Object.keys(order).length === 0) order.created_at = 'DESC';

    let [users, count] = await this.usersRepository.findAndCount({
      where,
      order,
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      select: ['id', 'unique_number', 'name', 'email', 'created_at', 'is_validate', 'is_active', 'password'],
      relations: ['student_campus', 'domisili', 'major_campus'],
    });

    const data = users.map(({ password, ...rest }) => ({
      ...rest,
      has_password: !!password
    }));

    const metaData = {
      page: Number(page),
      limit: Number(limit),
      totalData: count,
      totalPage: Math.ceil(count / Number(limit)),
    }

    return { status: 'success', message: 'Users retrieved successfully!', data, metaData };
  }
  
  async allDataMonitoring() {
    const [
      totalUsers,
      activeUsers,
      unvalidatedUsers,
      totalStudentCampuss,
      totalMajorCampuss,
      totalStudentChapters,
      totalPrograms,
      totalStructurOrganizations,
      totalProgramAlumnis,
      totalEvents,
      upcomingEvents,
      cancelEvents,
      activeEvents,
      finishedEvents,
    ] = await Promise.all([
      this.usersRepository.count(),
      this.usersRepository.count({ where: { is_active: true } }),
      this.usersRepository.count({ where: { is_validate: false } }),

      this.studentCampusRepository.count(),

      this.majorCampusRepository.count(),

      this.studentChapterRepository.count(),

      this.programRepository.count(),

      this.organizationalStructureRepository.count(),

      this.programAlumniRepository.count(),

      this.eventRepository.count(),
      this.eventRepository.count({ where: { status: StatusEvents.UPCOMING } }),
      this.eventRepository.count({ where: { status: StatusEvents.CANCEL } }),
      this.eventRepository.count({ where: { status: StatusEvents.ACTIVE } }),
      this.eventRepository.count({ where: { status: StatusEvents.DONE } }),
    ]);

    return {
      status: 'success',
      message: 'Monitoring data retrieved successfully!',
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          unvalidated: unvalidatedUsers,
        },
        student_campus: {
          total: totalStudentCampuss,
        },
        major_campus: {
          total: totalMajorCampuss,
        },
        student_chapter: {
          total: totalStudentChapters,
        },
        programs: {
          total: totalPrograms,
        },
        organizational_structure: {
          total: totalStructurOrganizations,
        },
        program_alumni: {
          total: totalProgramAlumnis,
        },
        events: {
          total: totalEvents,
          upcoming: upcomingEvents,
          active: activeEvents,
          finished: finishedEvents,
          cancel: cancelEvents,
        },
      },
    };
  }

  async dataMonitoring() {
    const [
      totalUsers,
      totalStudentCampuss,
      totalMajorCampuss,
      totalStudentChapters,
      totalEvents,
    ] = await Promise.all([
      this.usersRepository.count(),

      this.studentCampusRepository.count(),

      this.majorCampusRepository.count(),

      this.studentChapterRepository.count(),

      this.eventRepository.count(),
    ]);

    return {
      status: 'success',
      message: 'Monitoring data retrieved successfully!',
      data: {
        users: {
          total: totalUsers,
        },
        student_campus: {
          total: totalStudentCampuss,
        },
        major_campus: {
          total: totalMajorCampuss,
        },
        student_chapter: {
          total: totalStudentChapters,
        },
        events: {
          total: totalEvents,
        },
      },
    };
  }

  async getPublicInformationUser(queryDto: QueryGetAllDto) {
    const { page = 1, limit = 10, query, domisili_id, campus_id, student_chapter_id, student_club_id, sort } = queryDto;
    let where: FindOptionsWhere<Users> = {};
    let order: Record<string, 'ASC' | 'DESC'> = {};
    let sorting = {}

    if (query) where.name = ILike(`%${query}%`);

    if (campus_id) where.student_campus = { id: campus_id };

    if (domisili_id) where.domisili = { id: domisili_id };

    if (student_chapter_id) where.student_chapter = { id: student_chapter_id };

    if (student_club_id) where.student_club = { id: student_club_id };

    where.is_validate = true;

    const roleMember = await this.rolesRepository.findOne({
      where: { name: 'member' }
    });

    if (!roleMember) {
      throw new Error('Role member not found');
    }

    where.role = { id: roleMember.id };

    if (typeof sort === 'string') {
      sorting = JSON.parse(sort)
    } else {
      sorting = sort;
    }

    if (sorting && typeof sorting === 'object' && Object.keys(sorting).length > 0) {
      for (const [key, value] of Object.entries(sorting)) {
        if (typeof key === 'string' && (value === 0 || value === 1)) {
          order[key] = value === 0 ? 'ASC' : 'DESC';
        }
      }
    }

    if (Object.keys(order).length === 0) order.created_at = 'DESC';

    const [data, count] = await this.usersRepository.findAndCount({
      where,
      order,
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      select: ['id', 'unique_number', 'name', 'created_at', 'is_validate', 'is_active'],
      relations: ['student_campus', 'student_chapter', 'student_club', 'social_media'],
    });

    const metaData = {
      page: Number(page),
      limit: Number(limit),
      totalData: count,
      totalPage: Math.ceil(count / Number(limit)),
    }

    return { status: 'success', message: 'Users public information retrieved successfully!', data, metaData };
  }

  async validationAccount(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const headerData: HeaderData = {
      subject: 'Your Digistar Club Account Has Been Verified!',
      to_email: user.email,
      from_email: 'Digistar Club <noreply@digistarclub.com>',
      name: user.email.split('@')[0],
    };

    const respEmail = await emailVerificationHelper.sendEmailVerification(headerData, TemplateHTML.templateValidationAccount(user.email));
    if (respEmail.message !== `Email terkirim ke ${headerData.to_email}`) {
      throw new BadRequestException(respEmail.message);
    }

    return { status: 'success', message: 'Account validation email sent successfully!', data: { email: user.email } };
  }

  async createUser(registerUserDto: RegisterUserDto): Promise<Users> {
    const { password, ...userData } = registerUserDto;
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,  
    });
  
    return this.usersRepository.save(user); 
  }

  async createLogging(loggingRequest: LoggingRequestDto, userPayload: UserPayloadDto) {
    let userData: Users;
    if (userPayload && userPayload.role !== 'admin') {
      userData = await this.usersRepository.findOne({where: {id: userPayload.sub}})
    }
    console.log(userData)
    console.log(loggingRequest.client_ip)
    if (loggingRequest.client_ip === undefined && userData === undefined)  {
      throw new BadRequestException("Client IP required")
    }
    const loggingData = this.loggingRepository.create({
      ...loggingRequest,
      user: userData,
      created_at: new Date()
    })

    return this.loggingRepository.save(loggingData)
  }

  async createMember(createMemberDto: CreateMemberDto) {
    const { password, social_media, ...memberData } = createMemberDto;
    let majorCampus: MajorCampus;
    let studentCampus: StudentCampus;
    let studentChapter: StudentChapter;
    let domisili: Domisili;
    let socialMedia: SocialMedia;
    let dataMember:any = { ...memberData }
    
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: createMemberDto.email },
        { phone: createMemberDto.phone },
      ],
    });

    if (existingUser) {
      throw new BadRequestException('Email atau nomor telepon sudah digunakan');
    }

    const existingEmailVerification = await this.emailVerificationRepository.findOne({
      where: { email: createMemberDto.email, verified: true, type: "register" },
    });

    if (!existingEmailVerification) {
      throw new BadRequestException('Email belum diverifikasi');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    dataMember.password = hashedPassword;

    const generateID = await helper.generatePublicID(new Date(), this.usersRepository)
    dataMember.unique_number = generateID;

    if (createMemberDto.major_campus_id) {
      majorCampus = await this.majorCampusRepository.findOne({
        where: { id: createMemberDto.major_campus_id },
      });

      if (!majorCampus) {
        throw new NotFoundException('Major Campus not found');
      }
      dataMember.major_campus = majorCampus;
    } else if (createMemberDto.major_campus_name) {
      majorCampus = await this.majorCampusRepository.findOne({
        where: {
          major: Raw(alias => `LOWER(${alias}) = LOWER(:major)`, {
            major: createMemberDto.major_campus_name
          }),
        }
      });

      if (!majorCampus) {
        majorCampus = this.majorCampusRepository.create({
          major: createMemberDto.major_campus_name,
        });
        await this.majorCampusRepository.save(majorCampus);
      }
      dataMember.major_campus = majorCampus;
    } else {
      throw new BadRequestException('Major Campus is required');
    }

    if (createMemberDto.student_campus_id) {
      studentCampus = await this.studentCampusRepository.findOne({
        where: { id: createMemberDto.student_campus_id },
      });

      if (!studentCampus) {
        throw new NotFoundException('Student Campus not found');
      }
      dataMember.student_campus = studentCampus;
    } else if (createMemberDto.student_campus_name) {
      studentCampus = await this.studentCampusRepository.findOne({
        where: {
          institute: Raw(alias => `LOWER(${alias}) = LOWER(:institute)`, {
            institute: createMemberDto.student_campus_name
          }),
        }
      });

      if (!studentCampus) {
        studentCampus = this.studentCampusRepository.create({
          institute: createMemberDto.student_campus_name,
        });
        await this.studentCampusRepository.save(studentCampus);
      }
      dataMember.student_campus = studentCampus;
    } else {
      throw new BadRequestException('Student Campus is required');
    }

    if (createMemberDto.domisili_id) {
      domisili = await this.domisiliRepository.findOne({
        where: { id: createMemberDto.domisili_id },
      });

      if (!domisili) {
        throw new NotFoundException('Domisili not found');
      }
      dataMember.domisili = domisili;
    } else if (createMemberDto.domisili_name) {
      domisili = await this.domisiliRepository.findOne({
        where: {
          domisili: Raw(alias => `LOWER(${alias}) = LOWER(:domisili)`, {
            domisili: createMemberDto.domisili_name
          }),
        }
      });

      if (!domisili) {
        domisili = this.domisiliRepository.create({
          domisili: createMemberDto.domisili_name,
        });
        await this.domisiliRepository.save(domisili);
      }
      dataMember.domisili = domisili;
    }

    if (createMemberDto.student_chapter_id) {
      studentChapter = await this.studentChapterRepository.findOne({
        where: { id: createMemberDto.student_chapter_id },
      });
      dataMember.student_chapter = studentChapter;
    }

    if (social_media) {
      socialMedia = this.socialMediaRepository.create({
        instagram: social_media?.instagram,
        telegram: social_media?.telegram,
        linkedin: social_media?.linkedin,
      });
      dataMember.social_media = socialMedia;
    }

    const roleMember = await this.rolesRepository.findOne({
      where: { name: 'public' }
    });

    if (!roleMember) {
      throw new Error('Role member not found');
    }
    dataMember.is_validate = false;
    dataMember.is_active = true;

    const user = this.usersRepository.create({
      ...dataMember,
      role: roleMember
    });

    const data = await this.usersRepository.save(user);

    if (!data) {
      throw new BadRequestException('Failed to create member');
    }

    return {
      status: 'success',
      message: 'Member successfully created!',
      data,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const verification = await this.emailVerificationRepository.findOne({
      where: { email: forgotPasswordDto.email, verification_token: forgotPasswordDto.token, type: "forgot-password"},
    });

    if (!verification) {
      throw new NotFoundException('Invalid or expired verification token');
    }

    if (Date.now() > verification.expires_at) {
      throw new BadRequestException('Verification token has expired');
    }

    await this.emailVerificationRepository.update(verification.id, {
      verified: true,
    });

    const passwordRandom = crypto.randomBytes(5)
                .toString('base64')
                .slice(0, 10);
    const hashedPassword = await bcrypt.hash(passwordRandom, 10);
    const user = await this.usersRepository.findOne({ where: { email: forgotPasswordDto.email } });
    if (!user) {
      throw new BadRequestException('User Not Found!');
    }

    await this.usersRepository.update(user.id, {
      password: hashedPassword
    });

    const headerData: HeaderData = {
      subject: 'Digistar Club Forgot Password',
      to_email: user.email,
      from_email: 'Digistar Club <noreply@digistarclub.com>',
      name: user.name,
    };

    const accountInfo: AccountInformationDto = {
      email: user.email,
      unique_number: user.unique_number,
      password: passwordRandom,
    };

    const respEmail = await emailVerificationHelper.sendEmailVerification(headerData, TemplateHTML.templateSendAccountInformation(headerData, accountInfo));

    if (respEmail.message !== `Email terkirim ke ${headerData.to_email}`) {
      throw new BadRequestException(respEmail.message);
    }

    return { status: 'success', message: 'Forgot Password successfully' };
  }

  async generateEmailVerificationToken(body: SendOtpDto) {
    const user = await this.usersRepository.findOne({ where: { email: body.email } });
    if (body.type == "register" && user) {
      throw new BadRequestException('Email already registered');
    }
    const existingVerification = await this.emailVerificationRepository.findOne({ where: { email: body.email, type: body.type } });
    if (existingVerification) {
      if (existingVerification.verified && body.type == "register") {
        return {
          status: 'success',
          message: 'Email already verified',
        }
      }
      if (Date.now() < existingVerification.expires_at) {
        return {
          status: 'success',
          message: 'Verification token already sent, please wait for it to expire',
        }
      }
    }
    const token = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
    const headerData: HeaderData = {
      subject: 'Digistar Club OTP Code',
      to_email: body.email,
      from_email: 'Digistar Club <noreply@digistarclub.com>',
      name: body.email.split('@')[0],
    };

    const respEmail = await emailVerificationHelper.sendEmailVerification(headerData, TemplateHTML.templateSendEmailVerification(headerData, token));
    if (respEmail.message !== `Email terkirim ke ${headerData.to_email}`) {
      throw new BadRequestException(respEmail.message);
    }
    if (existingVerification) {
      if (existingVerification.verified == false && Date.now() > existingVerification.expires_at) {
        await this.emailVerificationRepository.update(existingVerification.id, {
          verification_token: token,
          expires_at: Date.now() + 300000, // 5 minutes
        });
      }
    } else {
      await this.emailVerificationRepository.save({
        email: body.email,
        verification_token: token,
        type: body.type,
        expires_at: Date.now() + 300000, // 5 minutes
      });
    }

    return respEmail;
  }

  async verifyEmailToken(verifyDto: VerifyOtpDto) {
    const verification = await this.emailVerificationRepository.findOne({
      where: { email: verifyDto.email, verification_token: verifyDto.token, type: verifyDto.type},
    });

    if (!verification) {
      throw new NotFoundException('Invalid or expired verification token');
    }

    if (Date.now() > verification.expires_at) {
      throw new BadRequestException('Verification token has expired');
    }

    await this.emailVerificationRepository.update(verification.id, {
      verified: true,
    });

    return { status: 'success', message: 'Email verified successfully' };
  }

  async accountInformation(dataUser: ValidateMemberDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: dataUser.email,
        unique_number: dataUser.unique_number,
      },
      select: ['id', 'email', 'unique_number', 'name', 'password'],
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.is_active) throw new BadRequestException('User already active');

    if (typeof user.password === 'string' && user.password.length > 0) throw new BadRequestException('User already has a password set');

    const headerData: HeaderData = {
      subject: 'Digistar Club Account Information',
      to_email: user.email,
      from_email: 'Digistar Club <noreply@digistarclub.com>',
      name: user.name,
    };

    const pass = crypto.randomBytes(10)
               .toString('base64')
               .slice(0, 10);

    const hashedPassword = await bcrypt.hash(pass, 10);

    const accountInfo: AccountInformationDto = {
      email: user.email,
      unique_number: user.unique_number,
      password: pass,
    };

    const respEmail = await emailVerificationHelper.sendEmailVerification(headerData, TemplateHTML.templateSendAccountInformation(headerData, accountInfo));

    if (respEmail.message !== `Email terkirim ke ${headerData.to_email}`) {
      throw new BadRequestException(respEmail.message);
    }
    await this.usersRepository.update(user.id, {
      password: hashedPassword,
      is_active: true
    });

    return respEmail;
  }

  async getAllDomisili(queryDto: QueryGetAllDto) {
    const { page, limit, query } = queryDto;

    const qb = this.domisiliRepository
      .createQueryBuilder('domisili')
      .loadRelationCountAndMap('domisili.user_count', 'domisili.users');

    if (query) {
      qb.where('LOWER(domisili.domisili) LIKE LOWER(:query)', {
        query: `%${query.toLowerCase()}%`,
      });
    }

    if (!page || !limit) {
      const data = await qb.getMany();
      return {
        status: 'success',
        message: 'Domisili get successfully!',
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
      message: 'Domisili get successfully!',
      data,
      metaData,
    };
  }

  async createDomisili(domisiliDto: DomisiliDto) {
    await validate(domisiliDto).then((errors) => {
      if (errors.length > 0) {
        this.loggerService.debug(`${errors}`, domisiliDto.domisili);
      }
    });
    const existing = await this.domisiliRepository.findOne({
      where: {
        domisili: Raw(alias => `LOWER(${alias}) = LOWER(:domisili)`, {
          domisili: domisiliDto.domisili
        })
      }
    });

    if (existing) {
      throw new BadRequestException("Data Domisili already exist!");
    }

    await this.domisiliRepository.save({ ...domisiliDto, created_at: new Date() });

    return { status: 'success', message: 'Domisili created successfully!' };
  }

  async getOneDomisili(id: string) {
    const data = await this.domisiliRepository.findOne({ where: { id } });
    if (!data) {
      return { status: 'error', message: 'Domisili does not exist' };
    }

    return { status: 'success', message: 'Domisili found successfully!', data };
  }

  async updateDomisili(id: string, domisiliDto: DomisiliDto) {
    const errors = await validate(domisiliDto);
    if (errors.length > 0) {
      this.loggerService.debug(`${errors}`, domisiliDto.domisili);
      throw new BadRequestException('Validation failed');
    }

    const existing = await this.domisiliRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Domisili does not exist');
    }

    try {
      await this.domisiliRepository.update(id, {
        ...domisiliDto,
        updated_at: new Date(),
      });
    } catch (err) {
      this.loggerService.error(err.message, err.stack, "Users Service");
      throw new InternalServerErrorException('Failed to update Domisili');
    }

    return { status: 'success', message: 'Domisili updated successfully!' };
  }

  async deleteDomisili(id: string) {
    const domisili = await this.domisiliRepository
      .createQueryBuilder('domisili')
      .where('domisili.id = :id', { id })
      .loadRelationCountAndMap('domisili.user_count', 'domisili.users')
      .getOne();

    if (!domisili) {
      throw new BadRequestException({
        status: 'error',
        message: 'Domisili does not exist',
      });
    }

    const userCount = (domisili as any).user_count ?? 0;

    if (userCount > 0) {
      throw new BadRequestException({
        status: 'error',
        message: `Domisili tidak dapat dihapus karena sedang digunakan oleh ${userCount} user`,
      });
    }

    await this.domisiliRepository.delete(id);

    return {
      status: 'success',
      message: 'Domisili deleted successfully!',
    };
  }

  async validateMember(unique_number: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let genderU, majorId, campusId = "";
      const openApiHelper = new CommonOpenApi();

      const data = await queryRunner.manager.findOne(this.usersRepository.target, {
        where: { unique_number },
        relations: ["social_media", "major_campus", "student_campus"],
      });

      const roleData = await queryRunner.manager.findOne(this.rolesRepository.target, {
        where: { name: 'member' },
      });

      if (!roleData) throw new NotFoundException('Role member not found');
      if (!data) throw new NotFoundException('Member not found!');

      const generateID = await helper.generateDigistarID(new Date(), this.usersRepository);

      if (data.gender === 'L') genderU = "male";
      else if (data.gender === 'P') genderU = "female";

      const headerData: HeaderData = {
        subject: 'Your Digistar Club Account Has Been Verified!',
        to_email: data.email,
        from_email: 'Digistar Club <noreply@digistarclub.com>',
        name: data.email.split('@')[0],
      };

      const respEmail = await emailVerificationHelper.sendEmailVerification(
        headerData,
        TemplateHTML.templateValidationAccount(headerData.name),
      );

      if (respEmail.message !== `Email terkirim ke ${headerData.to_email}`) {
        throw new BadRequestException(respEmail.message);
      }

      await queryRunner.manager.update(this.usersRepository.target, data.id, {
        is_validate: true,
        role: roleData,
        unique_number: generateID,
        updated_at: new Date(),
      });

      let campusTms = await openApiHelper.getCampus(1, 10, data.student_campus.institute);

      if (campusTms.length > 0) {
        campusId = campusTms[0].id
      } else {
        campusTms = await openApiHelper.createCampus(data.student_campus.institute)
        campusId = campusTms.id
      }

      let majorTms = await openApiHelper.getMajorCampus(1, 10, campusId, data.major_campus.major)

      if (majorTms.length > 0) {
        majorId = majorTms[0].id
      } else {
        majorTms = await openApiHelper.createMajorCampus(campusId, data.major_campus.major)
        majorId = majorTms.id
      }

      const dataUserPayload: ParticipantDto = {
        event_id: process.env.EVENT_ID_NEW_MEMBER,
        type: "create",
        name: data.name,
        class_year: data.generation,
        gender: genderU,
        date_of_birth: data.birthday,
        email: data.email,
        phone_number: data.phone,
        major_id: majorId,
        instagram: data.social_media.instagram,
        linkedin: data.social_media.linkedin,
      };

      await openApiHelper.participantTransaction(dataUserPayload);

      await queryRunner.commitTransaction();

      return {
        status: 'success',
        message: 'Member Validate successfully!'
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;

    } finally {
      await queryRunner.release();
    }
  }

  async checkUniqueMember(validateMemberDto: ValidateMemberDto) {
    let where: FindOptionsWhere<Users> = {};

    if (validateMemberDto.email) where.email = validateMemberDto.email

    if (validateMemberDto.unique_number) where.unique_number = validateMemberDto.unique_number

    const data = await this.usersRepository.findOne({ where, select: ["name", "unique_number"] });

    if (!data) {
      throw new NotFoundException('Member not found!');
    }

    return {
      status: 'success',
      message: 'Member with unique number',
      data
    }
  }

  async getProfileUser(req: Request) {
    const openApiHelper = new CommonOpenApi();
    const informationUser = await openApiHelper.getUserInformation(req.user.email)
    const data = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.student_club', 'student_clubs')
      .leftJoinAndSelect('user.student_campus', 'student_campuss')
      .leftJoinAndSelect('user.major_campus', 'major_campuss')
      .leftJoinAndSelect('user.domisili', 'domisili')
      .leftJoinAndSelect('user.social_media', 'social_media')
      .leftJoinAndSelect('user.student_chapter', 'student_chapters')
      .leftJoinAndSelect('user.program_alumni', 'program_alumni')
      .select([
        'user.name',
        'user.email',
        'user.phone',
        'user.unique_number',
        'user.status',
        'user.regional_origin',
        'user.gender',
        'user.image_profile_path',
        'user.image_cover_path',
        'user.birthday',
        'user.generation',
        'student_clubs.id',
        'student_clubs.name',
        'student_campuss.id',
        'student_campuss.institute',
        'major_campuss.id',
        'major_campuss.major',
        'domisili.id',
        'domisili.domisili',
        'social_media.id',
        'social_media.instagram',
        'social_media.telegram',
        'social_media.linkedin',
        'student_chapters.id',
        'student_chapters.institute',
        'program_alumni.id',
        'program_alumni.name'
      ])
      .where('user.id = :id', { id: req.user.sub })
      .getOne();
    return {
      status: 'success',
      message: 'Get Information Member successfully!',
      data: {
        ...data,
        level: informationUser.participant_level
      }
    }
  }

  async generateDefaultPassword(users_id: string[]) {
    for (const id of users_id) {
      const user = await this.usersRepository.findOne({ where: { id } });
      const passwordRandom = crypto.randomBytes(5)
                .toString('base64')
                .slice(0, 10);
      const hashedPassword = await bcrypt.hash(passwordRandom, 10);
      const headerData: HeaderData = {
        subject: 'Digistar Club Account Information',
        to_email: user.email,
        from_email: 'Digistar Club <noreply@digistarclub.com>',
        name: user.name,
      };
      const dataAccount: AccountInformationDto = {
        email: user.email,
        unique_number: user.unique_number,
        password: passwordRandom,
      };

      const respEmail = await emailVerificationHelper.sendEmailVerification(headerData, TemplateHTML.templateSendAccountInformation(headerData, dataAccount));
      if (respEmail.message !== `Email terkirim ke ${headerData.to_email}`) {
        throw new BadRequestException(respEmail.message);
      }
      await this.usersRepository.update(id, {
        password: hashedPassword,
        is_active: true
      });
    }

    return {
      status: 'success',
      message: 'Default password generated and sent successfully!',
      data: { users_id }
    };
  }

  async deleteImageUser(userPayload: UserPayloadDto, delDto: DeleteImageDto) {
    const existingUser = await this.usersRepository.findOne({
      where: {id: userPayload.sub },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (delDto.type === 'all') {
      if (existingUser.image_profile_path) {
        await this.uploadsService.deleteFileData(existingUser.image_profile_path);
        existingUser.image_profile_path = null;
      }
      if (existingUser.image_cover_path) {
        await this.uploadsService.deleteFileData(existingUser.image_cover_path);
        existingUser.image_cover_path = null;
      }
    } else if (delDto.type === 'profile') {
      if (existingUser.image_profile_path) {
        await this.uploadsService.deleteFileData(existingUser.image_profile_path);
        existingUser.image_profile_path = null;
      } else {
        return {
          status: 'success',
          message: `Profile image deleted successfully!`,
        }
      }
    } else if (delDto.type === 'cover') {
      if (existingUser.image_cover_path) {
        await this.uploadsService.deleteFileData(existingUser.image_cover_path);
        existingUser.image_cover_path = null;
      } else {
        return {
          status: 'success',
          message: `Cover image deleted successfully!`,
        }
      }
    } else {
      throw new BadRequestException('Invalid type');
    }

    Object.assign(existingUser, { updated_at: new Date() });

    const data = await this.usersRepository.save(existingUser);

    return {
      status: 'success',
      message: `${delDto.type === 'profile' ? 'Profile' : 'Cover'} image deleted successfully!`,
      data
    }
  }

  async updateProfileUser(
    req: Request,
    body: UpdateUserDto,
    files: {
      image_profile?: Express.Multer.File[];
      image_cover?: Express.Multer.File[];
    }
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let { social_media, ...memberData } = body;

      const openApiHelper = new CommonOpenApi();

      const existingUser = await queryRunner.manager.findOne(this.usersRepository.target, {
        where: { id: req.user.sub },
        relations: ["social_media", "major_campus", "student_campus"],
      });

      if (!existingUser) throw new NotFoundException("User not found");

      if (files.image_profile?.[0]) {
        if (files.image_profile[0].size > 1024 * 1024)
          throw new BadRequestException("Ukuran file profile > 1MB");

        if (existingUser.image_profile_path)
          await this.uploadsService.deleteFileData(existingUser.image_profile_path);

        const imageData = await this.uploadsService.saveSingleFile(
          files.image_profile[0],
          "users"
        );
        existingUser.image_profile_path = imageData.image;
      }

      if (files.image_cover?.[0]) {
        if (files.image_cover[0].size > 1024 * 1024)
          throw new BadRequestException("Ukuran file cover > 1MB");

        if (existingUser.image_cover_path)
          await this.uploadsService.deleteFileData(existingUser.image_cover_path);

        const imageData = await this.uploadsService.saveSingleFile(
          files.image_cover[0],
          "users"
        );
        existingUser.image_cover_path = imageData.image;
      }

      if (social_media) {
        const socmed = this.socialMediaRepository.create({
          instagram: social_media.instagram,
          telegram: social_media.telegram,
          linkedin: social_media.linkedin,
        });

        existingUser.social_media = socmed;
      }

      let campusChanged = false;
      if (memberData.student_campus_id) {
        const campus = await queryRunner.manager.findOne(this.studentCampusRepository.target, {
          where: { id: memberData.student_campus_id },
        });
        if (!campus) throw new NotFoundException("Student campus not found");

        if (!existingUser.student_campus || existingUser.student_campus.id !== campus.id) {
          campusChanged = true;
        }
        existingUser.student_campus = campus;
      }

      let majorChanged = false;
      if (memberData.major_campus_id) {
        const major = await queryRunner.manager.findOne(this.majorCampusRepository.target, {
          where: { id: memberData.major_campus_id },
        });
        if (!major) throw new NotFoundException("Major campus not found");

        if (!existingUser.major_campus || existingUser.major_campus.id !== major.id) {
          majorChanged = true;
        }
        existingUser.major_campus = major;
      }

      Object.assign(existingUser, memberData, {
        updated_at: new Date(),
      });

      const userUpdated = await queryRunner.manager.save(existingUser);

      if (campusChanged || majorChanged) {
        let campusId = "";
        let majorId = "";

        let campusTms = await openApiHelper.getCampus(1, 10, userUpdated.student_campus.institute);
        if (campusTms.length > 0) {
          campusId = campusTms[0].id;
        } else {
          const newCampus = await openApiHelper.createCampus(userUpdated.student_campus.institute);
          campusId = newCampus.id;
        }

        let majorTms = await openApiHelper.getMajorCampus(
          1,
          10,
          campusId,
          userUpdated.major_campus.major
        );

        if (majorTms.length > 0) {
          majorId = majorTms[0].id;
        } else {
          const newMajor = await openApiHelper.createMajorCampus(
            campusId,
            userUpdated.major_campus.major
          );
          majorId = newMajor.id;
        }

        const payloadUpdateThirdParty = {
          event_id: process.env.EVENT_ID_NEW_MEMBER,
          type: "update",
          name: userUpdated.name,
          class_year: userUpdated.generation,
          gender: userUpdated.gender === "L" ? "male" : "female",
          date_of_birth: userUpdated.birthday,
          email: userUpdated.email,
          phone_number: userUpdated.phone,
          major_id: majorId,
          instagram: userUpdated.social_media?.instagram,
          linkedin: userUpdated.social_media?.linkedin,
        };

        const respAPI = await openApiHelper.participantTransaction(payloadUpdateThirdParty);
        if (!respAPI || respAPI.status !== "success") {
          throw new BadRequestException("Gagal update data ke OpenAPI");
        }
      }

      await queryRunner.commitTransaction();

      return {
        status: "success",
        message: "Profile updated successfully!",
        data: userUpdated,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async resetPassword(req: Request, body: ResetPasswordDto) {
    const user = await this.usersRepository.findOne({ where: { id: req.user.sub } });

    if (!user) throw new NotFoundException('User not found');

    const isMatch = await user.validatePassword(body.old_password);
    if (!isMatch) throw new UnauthorizedException('Old Password is incorrect');

    if (body.new_password !== body.confirm_new_password) {
      throw new BadRequestException('New Password and Confirm Password dont match');
    }

    const hashedPassword = await bcrypt.hash(body.new_password, 10);
    
    await this.usersRepository.update(user.id, {
      password: hashedPassword,
      updated_at: new Date(),
    });

    return {
      status: 'success',
      message: 'Password reset successfully!',
    };
  }

  async registeredEventUser(req: Request, queryDto: QueryGetAllCommonDto) {
    const { page = 1, limit = 10, query, sort } = queryDto;

    const qb = this.usersRepository.createQueryBuilder('user')
      .leftJoin('user.event_members', 'event_member')
      .leftJoin('event_member.detail_event', 'detail_event')
      .leftJoin('detail_event.event', 'event')
      .loadRelationCountAndMap('user.registeredEventsCount', 'user.event_members')
      .select([
        'user.id as user_id',
        'event.id as event_id',
        'event.name',
        'event.description',
        'event.place',
        'event.status',
        'event.type',
        'event.created_at'
      ])
      .where('user.id = :userId', { userId: req.user.sub })
      .groupBy('user.id')
      .addGroupBy('event.id')
      .addGroupBy('event.created_at');

    if (query) {
      qb.where('event.name ILIKE :query', { query: `%${query}%` });
    }

    if (sort) {
      const sorting = typeof sort === 'string' ? JSON.parse(sort) : sort;
      for (const [key, value] of Object.entries(sorting)) {
        qb.addOrderBy(`event.${key}`, value === 0 ? 'ASC' : 'DESC');
      }
    } else {
      qb.orderBy('event.created_at', 'DESC');
    }

    qb.skip((Number(page) - 1) * Number(limit))
      .take(Number(limit));

    const [data, count] = await Promise.all([
      qb.getRawMany(),
      qb.getCount()
    ]);


    const metaData = {
      page: Number(page),
      limit: Number(limit),
      totalData: count,
      totalPage: Math.ceil(count / Number(limit)),
    };

    return {
      status: 'success',
      message: 'Registered events retrieved successfully!',
      data,
      metaData,
    };
  }

  // Find a user by email
  async findOneByUsername(email: string): Promise<Users | undefined> {
    return this.usersRepository.findOne({
      where: [
        { email: email },
        { unique_number: email },
      ],
    });
  }
}
