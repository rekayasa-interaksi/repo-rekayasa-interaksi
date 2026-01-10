import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UploadsService } from '../uploads/uploads.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { UserHelper as helper } from '../helpers/user.helper';
import { StudentClub } from '../student-clubs/entities/student-club.entity';
import { DataSource, FindOptionsWhere, ILike, In, IsNull, Not, Repository } from 'typeorm';
import { EventsDto } from './dto/events.dto';
import { LoggerService } from '../logger/logger.service';
import { QueryDto } from './dto/query.dto';
import * as dotenv from 'dotenv';
import { Request } from 'express';
import { Programs } from '../programs/entities/programs.entity';
import { DetailEvent } from './entities/detail-event.entity';
import { RegisterEventDto } from './dto/register-event.dto';
import { Users } from '../users/entities/users.entitiy';
import { StudentCampus } from '../student-campus/entities/student-campus.entity';
import { MajorCampus } from '../major-campus/entities/major-campus.entity';
import { FeedbackEventDto } from './dto/feedback-event.dto';
import { DurationEvents, EventMember } from './entities/event-members.entity';
import { Domisili } from '../users/entities/domisili.entity';
import { StudentChapter } from '../student-chapters/entities/student-chapters.entity';
import { EventImages } from './entities/event-images';
import { EventLinks } from './entities/event-links';
import { UserPayloadDto } from '../users/dto/user-payload.dto';
import { BulkEventDocumentationsDto } from './dto/bulk-event-documentations.dto';
import { EventDocumentations } from './entities/event-documentations';
import { BigEventDto } from './dto/big-event.dto';
import { Roles } from 'src/roles/entities/roles.entity';
import { EmailVerification } from 'src/users/entities/email-verification.entity';
import { SendLinkMeetingDto } from './dto/send-link-meet.dto';
import { HeaderData } from 'src/helpers/email-verif.dto';
import emailVerificationHelper from 'src/helpers/email-verification.helper';
import TemplateHTML from 'src/helpers/template-html.helper';
import { ShareLinkDto } from './dto/share-link.dto';
import { CommonOpenApi } from 'src/helpers/common';
import { EventOrganizations } from './entities/event-organization.entity';
import { ExternalOrganization } from 'src/external-organizations/entities/external-organization.entity';
import { EventDocumentationsDto } from './dto/event-documentations.dto';
import { AchievementDto } from './dto/achievement.dto';
import { Achievement } from './entities/achievement.entity';
import { CreateEventTmsDto } from './dto/create-event-tms.dto';
import { UpdateEventTmsDto } from './dto/update-event-tms.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ParticipantDto } from 'src/helpers/dto/participant-dto';
import { QueryEventDto } from './dto/query-event.dto';
import { EmployerBranding } from './entities/employer-brandings.entity';

dotenv.config();

@Injectable()
export class EventsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly loggerService: LoggerService,
    private readonly uploadsService: UploadsService,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(StudentClub)
    private readonly studentClubRepository: Repository<StudentClub>,

    @InjectRepository(Programs)
    private readonly programsRepository: Repository<Programs>,

    @InjectRepository(DetailEvent)
    private readonly detailEventRepository: Repository<DetailEvent>,

    @InjectRepository(EventMember)
    private readonly eventMemberRepository: Repository<EventMember>,

    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(StudentCampus)
    private readonly studentCampusRepository: Repository<StudentCampus>,

    @InjectRepository(StudentChapter)
    private readonly studentChapterRepository: Repository<StudentChapter>,

    @InjectRepository(MajorCampus)
    private readonly majorCampusRepository: Repository<MajorCampus>,

    @InjectRepository(Domisili)
    private readonly domisiliRepository: Repository<Domisili>,

    @InjectRepository(EventImages)
    private readonly eventImagesRepository: Repository<EventImages>,

    @InjectRepository(EventLinks)
    private readonly eventLinksRepository: Repository<EventLinks>,

    @InjectRepository(EventDocumentations)
    private readonly eventDocumentationsRepository: Repository<EventDocumentations>,

    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,

    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,

    @InjectRepository(EventOrganizations)
    private readonly eventOrganizationsRepository: Repository<EventOrganizations>,

    @InjectRepository(ExternalOrganization)
    private readonly externalOrganizationRepository: Repository<ExternalOrganization>,

    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,

    @InjectRepository(EmployerBranding)
    private readonly employerBrandingRepository: Repository<EmployerBranding>,

    @InjectRepository(Programs)
    private readonly programRepository: Repository<Programs>,
  ) {}

  async createEvent(
    userPayload: UserPayloadDto,
    eventsDto: EventsDto,
    files: { image?: Express.Multer.File[] },
  ) {
    const openApiHelper = new CommonOpenApi();
    const filesData = await this.uploadsService.savesFileData(files, 'events');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let studentClubName = ''

    try {
      const event = queryRunner.manager.create(Event, {
        name: eventsDto.name,
        description: eventsDto.description,
        place: eventsDto.place,
        event_activate: eventsDto.event_activated,
        status: eventsDto.status,
        type: eventsDto.type,
        rules: eventsDto.rules,
        program_category_id: eventsDto.program_category_id,
        program_type_id: eventsDto.program_type_id,
      });
      await queryRunner.manager.save(event);

      const allEventOrganizations = [];

      if (eventsDto.student_club_ids?.length > 0) {
        const studentClubs = await this.studentClubRepository.find({
          where: { id: In(eventsDto.student_club_ids) },
        });
        if (!studentClubs.length) throw new NotFoundException('Student clubs not found');

        studentClubName = studentClubs[0].name;

        allEventOrganizations.push(
          ...studentClubs.map(club =>
            this.eventOrganizationsRepository.create({
              event,
              student_club: club,
            }),
          ),
        );
      }

      if (eventsDto.student_chapter_ids?.length > 0) {
        const studentChapters = await this.studentChapterRepository.find({
          where: { id: In(eventsDto.student_chapter_ids) },
        });
        if (!studentChapters.length) throw new NotFoundException('Student chapters not found');

        allEventOrganizations.push(
          ...studentChapters.map(chapter =>
            this.eventOrganizationsRepository.create({
              event,
              student_chapter: chapter,
            }),
          ),
        );
      }

      if (eventsDto.external_organization_ids?.length > 0) {
        const externalOrganizations = await this.externalOrganizationRepository.find({
          where: { id: In(eventsDto.external_organization_ids) },
        });
        if (!externalOrganizations.length)
          throw new NotFoundException('External organizations not found');

        allEventOrganizations.push(
          ...externalOrganizations.map(org =>
            this.eventOrganizationsRepository.create({
              event,
              external_organization: org,
            }),
          ),
        );
      }

      if (allEventOrganizations.length > 0) {
        event.event_organizations = allEventOrganizations;
        await queryRunner.manager.save(allEventOrganizations);
      }

      let program: Programs;
      let eventTmsDto: CreateEventTmsDto = {
        poster: files.image?.[0],
        budget: 0,
        ticket_price: 0,
        target_participants: 100,
        location: eventsDto.place,
        source_budget: 'Self Funding',
        min_age: 17,
        max_age: 56,
        participant_background: eventsDto.type,
        program_categories_id: eventsDto.program_category_id,
        program_types_id: eventsDto.program_type_id,
        name: '',
        start_datetime: '',
        end_datetime: '',
        description: eventsDto.description,
        theme: studentClubName,
      };

      if (eventsDto.program_id) {
        program = await this.programsRepository.findOne({
          where: { id: eventsDto.program_id },
        });
        if (!program) throw new NotFoundException('Program not found');
        eventTmsDto.theme = program.name;
        event.program = program;
      }

      event.created_at = new Date();
      event.created_by = userPayload.sub;
      const savedEvent = await queryRunner.manager.save(event);

      if (eventsDto.detail_events?.length > 0) {
        for (const detail of eventsDto.detail_events) {
          eventTmsDto.name = detail.title;
          eventTmsDto.start_datetime = `${detail.date}T${detail.start_time}:00.000Z`;
          eventTmsDto.end_datetime = `${detail.date}T${detail.end_time}:00.000Z`;
          const data = await openApiHelper.createEvent(eventTmsDto);
          const detailEvent = this.detailEventRepository.create({
            title: detail.title,
            date: detail.date,
            start_time: detail.start_time,
            end_time: detail.end_time,
            client_id: data.id,
            event: savedEvent,
          });

          await queryRunner.manager.save(detailEvent);
        }
      }

      const links = this.eventLinksRepository.create({
        zoom: eventsDto.zoom,
        instagram: eventsDto.instagram,
        term_of_reference: eventsDto.term_of_reference,
        event: savedEvent,
      });
      await queryRunner.manager.save(links);

      if (filesData.images && filesData.images.length > 0) {
        if (eventsDto.event_images.length !== filesData.images.length) {
          throw new BadRequestException('Jumlah gambar dan metadata event_images tidak cocok.');
        }

        for (let i = 0; i < filesData.images.length; i++) {
          const imageMeta = eventsDto.event_images[i];
          const imageFile = filesData.images[i];
          const activatedValue =
            typeof imageMeta.activated === 'string' ? imageMeta.activated == 'true' : imageMeta.activated;

          const eventImage = this.eventImagesRepository.create({
            image_path: imageFile.filePath,
            activated: activatedValue,
            event: savedEvent,
          });

          await queryRunner.manager.save(eventImage);
        }
      }

      await queryRunner.commitTransaction();

      return {
        status: 'success',
        message: 'Event created successfully!',
        data: savedEvent,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Failed to create event (rollback triggered): ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async registerEvent(dto: RegisterEventDto, req: Request) {
    let user: Users;
    let dataUser: Partial<Users> = {
      email: dto.email, 
      name: dto.name,
      phone: dto.phone,
      status: dto.status,
      gender: dto.gender,
      generation: dto.generation,
    };

    const event = await this.eventRepository.findOne({where: {id: dto.event_id}})

    if (event.status != 'upcoming') {
      throw new BadRequestException('Maaf event ini sudah tidak menerima registrasi')
    }

    if (req.user) {
      user = await this.usersRepository.findOneBy({ id: req.user.sub });
      if (!user) throw new NotFoundException('User not found');
      if (event.type == "exclusive" && user.role.name == "public") {
        throw new BadRequestException('Maaf event ini hanya untuk member digistar club');
      }
    }
    
    // if (dto.unique_number) {
    //   user = await this.usersRepository.findOneBy({ unique_number: dto.unique_number });
    //   if (!user) throw new NotFoundException('User with unique_number not found');
    // } else {
    //   if (!dto.email || !dto.name) {
    //     throw new BadRequestException('Missing user information');
    //   }

    //   const existingEmailVerification = await this.emailVerificationRepository.findOne({
    //     where: { email: dto.email, verified: true },
    //   });

    //   if (!existingEmailVerification) {
    //     throw new BadRequestException('Email belum diverifikasi');
    //   }

    //   const roleUser = await this.rolesRepository.findOne({ where: { name: 'public' } });

    //   let studentCampus;
    //   if (dto.student_campus_id) {
    //     studentCampus = await this.studentCampusRepository.findOne({ where: { id: dto.student_campus_id } });
    //     if (!studentCampus) throw new NotFoundException('Student Campus not found');
    //     dataUser.student_campus = studentCampus;
    //   } else if (dto.student_campus_name) {
    //     studentCampus = await this.studentCampusRepository.findOne({
    //       where: { institute: ILike(dto.student_campus_name) },
    //     });
    //     if (!studentCampus) {
    //       studentCampus = this.studentCampusRepository.create({
    //         institute: dto.student_campus_name,
    //       });
    //       await this.studentCampusRepository.save(studentCampus);
    //     }
    //     dataUser.student_campus = studentCampus;
    //   }

    //   let majorCampus;
    //   if (dto.major_campus_id) {
    //     majorCampus = await this.majorCampusRepository.findOne({ where: { id: dto.major_campus_id } });
    //     if (!majorCampus) throw new NotFoundException('Major Campus not found');
    //     dataUser.major_campus = majorCampus;
    //   } else if (dto.major_campus_name) {
    //     majorCampus = await this.majorCampusRepository.findOne({
    //       where: { major: ILike(dto.major_campus_name) },
    //     });
    //     if (!majorCampus) {
    //       majorCampus = this.majorCampusRepository.create({
    //         major: dto.major_campus_name,
    //       });
    //       await this.majorCampusRepository.save(majorCampus);
    //     }
    //     dataUser.major_campus = majorCampus;
    //   }

    //   let domisili;
    //   if (dto.domisili_id) {
    //     domisili = await this.domisiliRepository.findOne({ where: { id: dto.domisili_id } });
    //     if (!domisili) throw new NotFoundException('Domisili not found');
    //     dataUser.domisili = domisili;
    //   } else if (dto.domisili_name) {
    //     domisili = await this.domisiliRepository.findOne({
    //       where: { domisili: ILike(dto.domisili_name) },
    //     });
    //     if (!domisili) {
    //       domisili = this.domisiliRepository.create({
    //         domisili: dto.domisili_name,
    //       });
    //       await this.domisiliRepository.save(domisili);
    //     }
    //     dataUser.domisili = domisili;
    //   }
    //   dataUser.role = roleUser;
    //   dataUser.is_validate = false;
    //   dataUser.is_active = false;

    //   const existingUser = await this.usersRepository.findOne({ where: { email: dto.email } });
    //   if (existingUser) {
    //     user = existingUser;
    //   } else {
    //     user = this.usersRepository.create(dataUser);
    //     await this.usersRepository.save(user);
    //   }
    // }
    const detail_events = await this.detailEventRepository.findBy({ event: {id: dto.event_id} })
    if (detail_events && detail_events.length > 0) {
      for (const detailEvent of detail_events) {
        const existingEventMember = await this.eventMemberRepository.findOne({
          where: {
            detail_event: { id: detailEvent.id },
            user: { id: user.id },
          },
        });

        if (existingEventMember) {
          throw new BadRequestException('Anda sudah terdaftar pada event ini');
        }
        const eventMember = this.eventMemberRepository.create({
          detail_event: detailEvent,
          user,
          attend: false,
        });
        await this.eventMemberRepository.save(eventMember);
        const employerBranding = this.employerBrandingRepository.create({
          event_member: eventMember
        })
        await this.employerBrandingRepository.save(employerBranding)
      }
    }
    return { message: 'Berhasil registrasi event' };
  }

  async feedbackEvent(
    feedbackEventDto: FeedbackEventDto,
    req: Request,
    files: { image?: Express.Multer.File[] }
  ) {
    let campusId, majorId;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let genderU = "";
      const openApiHelper = new CommonOpenApi();
      const { detail_event_id, ...dataFeedback } = feedbackEventDto;

      if (files?.image?.[0] && files.image[0].size > 1 * 1024 * 1024) {
        throw new BadRequestException("File melebihi batas ukuran 1MB");
      }

      if (!req.user) throw new UnauthorizedException("Anda diharuskan login terlebih dahulu");

      const user = await queryRunner.manager.findOne(this.usersRepository.target, {
        where: { id: req.user.sub },
        relations: ["social_media", "major_campus", "role", "student_campus"],
      });

      if (!user) throw new NotFoundException("User not found");

      genderU = user.gender === "L" ? "male" : "female";

      const detailEvent = await queryRunner.manager.findOne(this.detailEventRepository.target, {
        where: { id: detail_event_id },
        relations: ["event"],
      });

      if (!detailEvent) throw new NotFoundException("Detail Event tidak ditemukan");

      if (detailEvent.event.status === 'upcoming') {
        throw new BadRequestException('Maaf anda sudah tidak memiliki akses untuk presensi pada event ini')
      }

      if (detailEvent.event.status === 'cancel') {
        throw new BadRequestException('Maaf event ini sudah dibatalkan karena beberapa alasan')
      }

      if (detailEvent.event.status === "done") {
        throw new BadRequestException("Maaf anda telah melewati batas waktu presensi event ini");
      }

      if (detailEvent.event.type === "exclusive" && user.role.name === "public") {
        throw new BadRequestException("Event ini khusus untuk member digistar club");
      }

      const eventMember = await queryRunner.manager.findOne(this.eventMemberRepository.target, {
        where: { detail_event: { id: detail_event_id }, user: { id: user.id } }, relations: ['employer_branding']
      });

      if (!eventMember) throw new NotFoundException("Anda tidak terdaftar pada event ini");
      if (eventMember.attend) throw new BadRequestException("Anda sudah presensi untuk event ini");

      if (!eventMember.employer_branding) {
        eventMember.employer_branding = queryRunner.manager.create(
          EmployerBranding,
          {
            event_member: eventMember,
            created_by: user.id,
          }
        );
      }

      const fileData = await this.uploadsService.saveFileData(files, "evidences");

      eventMember.attend = true;
      // eventMember.duration = duration as DurationEvents;
      eventMember.material_quality = dataFeedback.material_quality;
      eventMember.delivery_quality = dataFeedback.delivery_quality;
      eventMember.next_topic = dataFeedback.next_topic;
      eventMember.suggest = dataFeedback.suggest;
      eventMember.rating = dataFeedback.rating
      eventMember.experience = dataFeedback.experience
      eventMember.testimoni = dataFeedback.testimoni
      eventMember.improvement = dataFeedback.improvement
      eventMember.favorite = dataFeedback.favorite
      // Employer Branding
      eventMember.employer_branding.recomendation_reason = dataFeedback.recomendation_reason
      eventMember.employer_branding.recomendation_company = dataFeedback.recomendation_company
      eventMember.employer_branding.alteration = dataFeedback.alteration
      eventMember.updated_at = new Date();

      if (fileData?.image) {
        eventMember.evidence_path = fileData.image;
      }

      await queryRunner.manager.save(eventMember.employer_branding);

      await queryRunner.manager.save(eventMember);

      let campusTms = await openApiHelper.getCampus(1, 10, user.student_campus.institute);

      if (campusTms.length > 0) {
        campusId = campusTms[0].id
      } else {
        campusTms = await openApiHelper.createCampus(user.student_campus.institute)
        campusId = campusTms.id
      }

      let majorTms = await openApiHelper.getMajorCampus(1, 10, campusId, user.major_campus.major)

      if (majorTms.length > 0) {
        majorId = majorTms[0].id
      } else {
        majorTms = await openApiHelper.createMajorCampus(campusId, user.major_campus.major)
        majorId = majorTms.id
      }

      const dataUserPayload: ParticipantDto = {
        event_id: detailEvent.client_id,
        type: "create",
        name: user.name,
        class_year: user.generation,
        gender: genderU,
        date_of_birth: user.birthday,
        email: user.email,
        phone_number: user.phone,
        major_id: majorId,
        instagram: user.social_media.instagram,
        linkedin: user.social_media.linkedin,
      };

      await openApiHelper.participantTransaction(dataUserPayload);

      await queryRunner.commitTransaction();

      return {
        message: "Berhasil memberikan feedback event",
        data: eventMember,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getEventRegistrants(eventId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['detail_events'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const detailEvents = event.detail_events;
    if (!detailEvents || detailEvents.length === 0) {
      throw new NotFoundException('Detail events not found for this event');
    }

    const registrants = [];
    for (const detailEvent of detailEvents) {
      const members = await this.eventMemberRepository.find({
        where: { detail_event: { id: detailEvent.id } },
        relations: ['user'],
      });
      registrants.push({
        detail_event: detailEvent,
        members: members.map((member) => ({
          user_id: member.user.id,
          name: member.user.name,
          email: member.user.email,
          unique_number: member.user.unique_number,
          attend: member.attend,
          duration: member.duration,
          evidence_path: member.evidence_path,
          suggestion: member.suggest,
          material_quality: member.material_quality,
          delivery_quality: member.delivery_quality,
          next_topic: member.next_topic,
        })),
      });
    }

    return {
      status: 'success',
      message: 'Registrants retrieved successfully',
      data: {
        event_name: event.name,
        status_event: event.status,
        registrants: registrants,
      },
    };
  }

  async getProgramCategory() {
    const openApiHelper = new CommonOpenApi();
    const data = await openApiHelper.filterProgramCategory()

    return {
      status: 'success',
      message: 'Success Get Program Category Event!',
      data
    }
  }

  async getProgramType() {
    const openApiHelper = new CommonOpenApi();
    const data = await openApiHelper.filterProgramType()

    return {
      status: 'success',
      message: 'Success Get Program Type Event!',
      data
    }
  }

  async getHistoryEvent(queryDto: QueryDto, userPayload: UserPayloadDto) {
    const { page = 1, limit = 10}  = queryDto;
    const qb = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.detail_events', 'detail_events')
      .leftJoin('detail_events.eventMembers', 'eventMembers')
      .leftJoinAndSelect('event.images', 'images')
      .leftJoinAndSelect('event.event_organizations', 'event_organizations')
      .leftJoinAndSelect('event_organizations.student_club', 'student_club')
      .leftJoinAndSelect('event_organizations.student_chapter', 'student_chapter')
      .leftJoinAndSelect('event_organizations.external_organization', 'external_organization')
      .leftJoinAndSelect('event.links', 'links')
      .where('eventMembers.user_id = :userId', { userId: userPayload.sub })
      .andWhere('eventMembers.attend = true')
      .andWhere('eventMembers.suggest IS NOT NULL')
      .andWhere('eventMembers.evidence_path IS NOT NULL')
      .andWhere('eventMembers.duration IS NOT NULL')
      .andWhere('eventMembers.material_quality IS NOT NULL')
      .andWhere('eventMembers.delivery_quality IS NOT NULL')
      .andWhere('eventMembers.next_topic IS NOT NULL')
      .take(limit)
      .skip((page - 1) * limit);

    const [data, count] = await qb.getManyAndCount();


    const metaData = {
      page: Number(page),
      limit: Number(limit),
      totalData: count,
      totalPage: Math.ceil(count / Number(limit)),
    }

    return {
      status: 'success',
      message: 'Events retrieved successfully!',
      data: data.map((event) => {
        const eventOrgs = event.event_organizations || [];
        const studentClubs = eventOrgs
          .filter((eo) => eo.student_club)
          .map((eo) => ({
            id: eo.student_club.id,
            name: eo.student_club.name,
            description: eo.student_club.description,
            image_url: eo.student_club.image_path
              ? `${process.env.BASE_URL_STORAGE}${eo.student_club.image_path}`
              : null,
            logo_url: eo.student_club.logo_path
              ? `${process.env.BASE_URL_STORAGE}${eo.student_club.logo_path}`
              : null,
          }));
        const studentChapters = eventOrgs
          .filter((eo) => eo.student_chapter)
          .map((eo) => ({
            id: eo.student_chapter.id,
            institute: eo.student_chapter.institute,
            address: eo.student_chapter.address,
            image_url: eo.student_chapter.image_path
              ? `${process.env.BASE_URL_STORAGE}${eo.student_chapter.image_path}`
              : null,
          }));
        const externalOrganizations = eventOrgs
          .filter((eo) => eo.external_organization)
          .map((eo) => ({
            id: eo.external_organization.id,
            name: eo.external_organization.name,
            image_url: eo.external_organization.image_path
              ? `${process.env.BASE_URL_STORAGE}${eo.external_organization.image_path}`
              : null,
          }));
        let image_url = '';
        if (Array.isArray(event.images)) {
          const activatedImage = event.images.find(
            (img) => img.activated && img.image_path,
          );
          if (activatedImage) {
            image_url = `${process.env.BASE_URL_STORAGE}${activatedImage.image_path}`;
          } else {
            image_url = event.images.length > 0
              ? `${process.env.BASE_URL_STORAGE}${event.images[0].image_path}`
              : '';
          }
        }
        return {
          ...event,
          detail_events: event.detail_events?.map(detail => {
            const { recording, ...rest } = detail;
            return rest;
          }) || [],
          image_url,
          links: (() => {
            if (!event.links) return null;
            if (userPayload && (userPayload.role === 'member' || userPayload.role === 'public')) {
              return {
                zoom: event.links.zoom,
                instagram: event.links.instagram
              };
            }
            return event.links;
          })(),
          event_organizations: {
            student_clubs: studentClubs,
            student_chapters: studentChapters,
            external_organizations: externalOrganizations,
          },
        };
      }),
      metaData,
    };
  }

  async getRegisterEventUser(queryDto: QueryDto, userPayload: UserPayloadDto) {
    const { page = 1, limit = 10}  = queryDto;
    let relations: string[] = ['detail_events', 'images', 'event_organizations', 'event_organizations.student_club', 'event_organizations.student_chapter', 'event_organizations.external_organization', 'links'];
    
    const [data, count] = await this.eventRepository.findAndCount({
      where: {
        detail_events: {eventMembers: {user: {id: userPayload.sub} }}
      },
      relations: relations,
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
      status: 'success',
      message: 'Events retrieved successfully!',
      data: data.map((event) => {
        const eventOrgs = event.event_organizations || [];
        const studentClubs = eventOrgs
          .filter((eo) => eo.student_club)
          .map((eo) => ({
            id: eo.student_club.id,
            name: eo.student_club.name,
            description: eo.student_club.description,
            image_url: eo.student_club.image_path
              ? `${process.env.BASE_URL_STORAGE}${eo.student_club.image_path}`
              : null,
            logo_url: eo.student_club.logo_path
              ? `${process.env.BASE_URL_STORAGE}${eo.student_club.logo_path}`
              : null,
          }));
        const studentChapters = eventOrgs
          .filter((eo) => eo.student_chapter)
          .map((eo) => ({
            id: eo.student_chapter.id,
            institute: eo.student_chapter.institute,
            address: eo.student_chapter.address,
            image_url: eo.student_chapter.image_path
              ? `${process.env.BASE_URL_STORAGE}${eo.student_chapter.image_path}`
              : null,
          }));
        const externalOrganizations = eventOrgs
          .filter((eo) => eo.external_organization)
          .map((eo) => ({
            id: eo.external_organization.id,
            name: eo.external_organization.name,
            image_url: eo.external_organization.image_path
              ? `${process.env.BASE_URL_STORAGE}${eo.external_organization.image_path}`
              : null,
          }));
        let image_url = '';
        if (Array.isArray(event.images)) {
          const activatedImage = event.images.find(
            (img) => img.activated && img.image_path,
          );
          if (activatedImage) {
            image_url = `${process.env.BASE_URL_STORAGE}${activatedImage.image_path}`;
          } else {
            image_url = event.images.length > 0
              ? `${process.env.BASE_URL_STORAGE}${event.images[0].image_path}`
              : '';
          }
        }
        return {
          ...event,
          image_url,
          detail_events: event.detail_events?.map(detail => {
            const { recording, ...rest } = detail;
            return rest;
          }) || [],
          links: (() => {
            if (!event.links) return null;
            if (userPayload && (userPayload.role === 'member' || userPayload.role === 'public')) {
              return {
                zoom: event.links.zoom,
                instagram: event.links.instagram
              };
            }
            return event.links;
          })(),
          event_organizations: {
            student_clubs: studentClubs,
            student_chapters: studentChapters,
            external_organizations: externalOrganizations,
          },
        };
      }),
      metaData,
    };
  }

  async getEventFeedbacks(eventId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['detail_events'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const detailEvents = event.detail_events;
    if (!detailEvents || detailEvents.length === 0) {
      throw new NotFoundException('Detail events not found for this event');
    }

    const feedbacks = [];
    for (const detailEvent of detailEvents) {
      const members = await this.eventMemberRepository.find({
        where: { detail_event: { id: detailEvent.id }, suggest: Not(IsNull()), attend: true, evidence_path: Not(IsNull()), duration: Not(IsNull()), material_quality: Not(IsNull()), delivery_quality: Not(IsNull()), next_topic: Not(IsNull()) },
        relations: ['user', 'employer_branding'],
      });
      feedbacks.push({
        detail_event: detailEvent,
        members: members.map((member) => ({
          user_id: member.user.id,
          name: member.user.name,
          email: member.user.email,
          unique_number: member.user.unique_number,
          attend: member.attend,
          duration: member.duration,
          evidence_path: member.evidence_path,
          suggestion: member.suggest,
          material_quality: member.material_quality,
          delivery_quality: member.delivery_quality,
          next_topic: member.next_topic,
          rating: member.rating,
          experience: member.experience,
          testimoni: member.testimoni,
          improvement: member.improvement,
          favorite: member.favorite,
          recomendation_reason: member.employer_branding?.recomendation_reason,
          recomendation_company: member.employer_branding?.recomendation_company,
          alteration: member.employer_branding?.alteration,
        })),
      });
    }

    return {
      status: 'success',
      message: 'Feedbacks retrieved successfully',
      data: {
        event_name: event.name,
        status_event: event.status,
        feedbacks: feedbacks,
      },
    };
  }

  async sendLinkMeeting(data: SendLinkMeetingDto) {
    const { zoom_link, event_id } = data;
    console.log('Sending Zoom link:', zoom_link, 'for event ID:', event_id);

    const event = await this.eventRepository.findOne({
      where: { id: event_id },
    });

    const users = await this.eventMemberRepository
      .createQueryBuilder('event_member')
      .leftJoinAndSelect('event_member.user', 'user')
      .leftJoin('event_member.detail_event', 'detailEvent')
      .leftJoin('detailEvent.event', 'event')
      .where('event.id = :eventId', { eventId: event_id })
      .distinctOn(['user.id'])
      .getMany();

    const results = await Promise.allSettled(users.map(async (listUser) => {
      const headerData: HeaderData = {
        subject: 'Link Zoom Meeting Event ' + event.name,
        to_email: listUser.user.email,
        from_email: 'Digistar Club <noreply@digistarclub.com>',
        name: listUser.user.email.split('@')[0],
      };

      const dataLink: ShareLinkDto = {
      zoom_link: zoom_link,
      name: listUser.user.name,
      };

      const respEmail = await emailVerificationHelper.sendEmailVerification(
      headerData,
      TemplateHTML.templateSendZoomLink(headerData, dataLink)
      );
      console.log('Response Email:', respEmail);
      if (respEmail.message !== `Email terkirim ke ${headerData.to_email}`) {
      throw new BadRequestException(respEmail.message);
      }
      return { email: headerData.to_email, status: 'success', message: respEmail.message };
    }));

    results.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
      this.loggerService.log(`Email sent to ${result.value.email}: ${result.value.message}`);
      } else {
      this.loggerService.error(`Failed to send email to ${users[idx].user.email}: ${result.reason}`);
      }
    });

    await this.eventLinksRepository.update(
      { event: { id: event_id } },
      { zoom: zoom_link, updated_at: new Date() }
    );

    return { status: 'success', message: 'Zoom link sent to all users.' };
  }

  async getAllEvent(queryDto: QueryEventDto, userPayload: UserPayloadDto) {
    const { page = 1, limit = 10, query, status, sort, student_chapter_id, student_club_id, program_id, external_organization_id}  = queryDto;
    let where: FindOptionsWhere<Event> = {};
    let order: Record<string, 'ASC' | 'DESC'> = {};
    let sorting = {}
    let links = {};
    let relations: string[] = ['detail_events', 'images', 'event_organizations', 'event_organizations.student_club', 'event_organizations.student_chapter', 'event_organizations.external_organization', 'program'];
    if (!userPayload || userPayload.role === 'member' || userPayload.role === 'public') {
      where.event_activate = true;
    }

    if (student_chapter_id) {
      where.event_organizations = { student_chapter : { id: student_chapter_id}}
    }

    if (student_club_id) {
      where.event_organizations = { student_club : { id: student_club_id}}
    }

    if (program_id) {
      where.program = { id: program_id }
    }

    if (external_organization_id) {
      where.event_organizations = { external_organization : { id: external_organization_id}}
    }

    let eventMembers = [];
    let joinMembers = [];
    if (userPayload && (userPayload.role === 'member'||userPayload.role === 'public')) {
      relations.push('links');
      eventMembers = await this.eventMemberRepository.find({
        where: { user: { id: userPayload.sub } },
        relations: ['detail_event', 'detail_event.event'],
        select: ['detail_event'],
      });
      joinMembers = await this.eventMemberRepository.find({
        where: { user: { id: userPayload.sub }, suggest: Not(IsNull()), attend: true, evidence_path: Not(IsNull()), duration: Not(IsNull()), material_quality: Not(IsNull()), delivery_quality: Not(IsNull()), next_topic: Not(IsNull()) },
        relations: ['detail_event', 'detail_event.event'],
        select: ['detail_event'],
      });
    } else if (userPayload && (userPayload.role === 'admin'||userPayload.role === 'superadmin')) {
      relations.push('links');
    }

    const eventIdsRegistered = new Set(
      eventMembers
        .filter((em) => em.detail_event?.event?.id)
        .map((em) => em.detail_event.event.id),
    );

    const detailEventIdsJoined = new Set(
      joinMembers
        .filter((em) => em.detail_event?.id)
        .map((em) => em.detail_event.id),
    );

    if (query) {
      where.name = ILike(`%${query}%`);
    }

    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];

      where.status = In(statusArray);
    }

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

    if (Object.keys(order).length === 0) {
      order.created_at = 'DESC';
    }

    const [data, count] = await this.eventRepository.findAndCount({
      where,
      order,
      relations: relations,
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
      status: 'success',
      message: 'Events retrieved successfully!',
      data: data.map((event) => {
        const eventOrgs = event.event_organizations || [];
        const isJoinedEvent = 
          userPayload && (userPayload.role === 'member' || userPayload.role === 'public')
            ? (event.detail_events?.length > 0 
              ? event.detail_events.every(detail => detailEventIdsJoined.has(detail.id))
              : false)
            : false;        
        const studentClubs = eventOrgs
          .filter((eo) => eo.student_club)
          .map((eo) => ({
            id: eo.student_club.id,
            name: eo.student_club.name,
            description: eo.student_club.description,
            image_url: eo.student_club.image_path
              ? `${process.env.BASE_URL_STORAGE}${eo.student_club.image_path}`
              : null,
            logo_url: eo.student_club.logo_path
              ? `${process.env.BASE_URL_STORAGE}${eo.student_club.logo_path}`
              : null,
          }));
        const studentChapters = eventOrgs
          .filter((eo) => eo.student_chapter)
          .map((eo) => ({
            id: eo.student_chapter.id,
            institute: eo.student_chapter.institute,
            address: eo.student_chapter.address,
            image_url: eo.student_chapter.image_path
              ? `${process.env.BASE_URL_STORAGE}${eo.student_chapter.image_path}`
              : null,
          }));
        const externalOrganizations = eventOrgs
          .filter((eo) => eo.external_organization)
          .map((eo) => ({
            id: eo.external_organization.id,
            name: eo.external_organization.name,
            image_url: eo.external_organization.image_path
              ? `${process.env.BASE_URL_STORAGE}${eo.external_organization.image_path}`
              : null,
          }));
        let image_url = '';
        if (Array.isArray(event.images)) {
          const activatedImage = event.images.find(
            (img) => img.activated && img.image_path,
          );
          if (activatedImage) {
            image_url = `${process.env.BASE_URL_STORAGE}${activatedImage.image_path}`;
          } else {
            image_url = event.images.length > 0
              ? `${process.env.BASE_URL_STORAGE}${event.images[0].image_path}`
              : '';
          }
        }
        return {
          ...event,
          detail_events: event.detail_events?.map(detail => {
            const { recording, ...rest } = detail;
            return {
              ...rest,
              is_joined:
                userPayload && (userPayload.role === 'member' || userPayload.role === 'public')
                  ? detailEventIdsJoined.has(detail.id)
                  : false,
            };
          }) || [],
          image_url,
          links: (() => {
            if (!event.links) return null;
            if (userPayload && (userPayload.role === 'member'||userPayload.role === 'public')) {
              return {
                zoom: event.links.zoom,
                instagram: event.links.instagram,
              };
            }
            return event.links;
          })(),
          is_registered: userPayload && (userPayload.role === 'member'||userPayload.role === 'public') ? eventIdsRegistered.has(event.id) : false,
          is_joined: isJoinedEvent,
          event_organizations: {
            student_clubs: studentClubs,
            student_chapters: studentChapters,
            external_organizations: externalOrganizations,
          },
        };
      }),
      metaData,
    };
  }

  async createDocumentation(documentationDto: BulkEventDocumentationsDto, files: {
    image?: Express.Multer.File[],
  }) {
    const filesData = await this.uploadsService.savesFileData(files, 'documentation_events');
    let detailEvent: DetailEvent
    const documentationData: EventDocumentations[] = []

    if (documentationDto.detail_event_id) {
      detailEvent = await this.detailEventRepository.findOne({
        where: {id: documentationDto.detail_event_id}
      })

      if (!detailEvent) {
        throw new NotFoundException('Detail Event not found');
      }
    }

    if (filesData.images && filesData.images.length > 0) {
      for (let i = 0; i < filesData.images.length; i++) {
        const imageFile = filesData.images[i];

        const eventImage = this.eventDocumentationsRepository.create({
          image_path: imageFile.filePath,
          detail_event: detailEvent,
        });

        const data = await this.eventDocumentationsRepository.save(eventImage);
        documentationData.push(data)
      }
    }

    return { status: 'success', message: 'Documentation Event created!', data: documentationData };
  }

  async getActiveDocumentation(queryDto: BigEventDto) {
    const { page = 1, limit = 6 } = queryDto;
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const where: FindOptionsWhere<EventDocumentations> = {};

    if (queryDto.is_active != undefined) {
      where.is_active = queryDto.is_active;
    }

    if (queryDto.is_big != undefined) {
      where.is_big = queryDto.is_big;
    }

    if (queryDto.is_active == undefined && queryDto.is_big == undefined) {
      throw new UnauthorizedException('Anda tidak memiliki akses untuk fitur ini')
    }

    const [data, count] = await this.eventDocumentationsRepository.findAndCount({
      where,
      relations: ['detail_event', 'detail_event.event'],
      take,
      skip,
    });

    const metaData = {
      page: Number(page),
      limit: Number(limit),
      totalData: count,
      totalPage: Math.ceil(count / Number(limit)),
    };

    return {
      status: 'success',
      message: 'Events Documentation retrieved successfully!',
      data: data.map((eventDoc) => ({
        ...eventDoc,
        image_url: eventDoc.image_path
          ? process.env.BASE_URL_STORAGE + eventDoc.image_path
          : null,
      })),
      metaData,
    };
  }

  async getDocumentation(queryDto: BigEventDto) {
    const { page = 1, limit = 6 } = queryDto;
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const where: FindOptionsWhere<EventDocumentations> = {};

    if (queryDto.is_active != undefined) {
      where.is_active = queryDto.is_active;
    }

    if (queryDto.is_big != undefined) {
      where.is_big = queryDto.is_big;
    }

    if (queryDto.event_id) {
      where.detail_event = { event: { id: queryDto.event_id } }
    }

    if (queryDto.detail_event_id) {
      where.detail_event = { id: queryDto.detail_event_id }
    }

    const [data, count] = await this.eventDocumentationsRepository.findAndCount({
      where,
      relations: ['detail_event', 'detail_event.event'],
      take,
      skip,
    });

    const metaData = {
      page: Number(page),
      limit: Number(limit),
      totalData: count,
      totalPage: Math.ceil(count / Number(limit)),
    };

    return {
      status: 'success',
      message: 'Events Documentation retrieved successfully!',
      data: data.map((eventDoc) => ({
        ...eventDoc,
        image_url: eventDoc.image_path
          ? process.env.BASE_URL_STORAGE + eventDoc.image_path
          : null,
      })),
      metaData,
    };
  }

  async getDocumentationByDetailEvent(detailEventId: string, queryDto: BigEventDto) {
    const { page = 1, limit = 10 } = queryDto;
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const where: FindOptionsWhere<EventDocumentations> = {detail_event: {id: detailEventId}};

    if (queryDto.is_active != undefined) {
      where.is_active = queryDto.is_active;
    }

    if (queryDto.is_big != undefined) {
      where.is_big = queryDto.is_big;
    }

    const [data, count] = await this.eventDocumentationsRepository.findAndCount({
      where,
      relations: ['detail_event', 'detail_event.event'],
      take,
      skip,
    });

    const metaData = {
      page: Number(page),
      limit: Number(limit),
      totalData: count,
      totalPage: Math.ceil(count / Number(limit)),
    };

    return {
      status: 'success',
      message: 'Events Documentation retrieved successfully!',
      data: data.map((eventDoc) => ({
        ...eventDoc,
        image_url: eventDoc.image_path
          ? process.env.BASE_URL_STORAGE + eventDoc.image_path
          : null,
      })),
      metaData,
    };
  }

  async deleteEvent(id: string) {
    const openApiHelper = new CommonOpenApi();
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const data = await queryRunner.manager.findOne(Event, {
        where: { id },
        relations: [
          'detail_events',
          'detail_events.eventMembers',
          'images',
          'links',
          'event_organizations',
          'detail_events.eventMembers.employer_branding'
        ],
      });

      if (!data) {
        throw new BadRequestException('Event does not exist');
      }

      const imagePaths = data.images?.map(img => img.image_path).filter(Boolean);
      if (imagePaths?.length > 0) {
        await this.uploadsService.deletesFileData(imagePaths);
      }

      let clientIds: string[] = [];

      if (data.detail_events?.length > 0) {
        clientIds = data.detail_events
          .map((d) => d.client_id)
          .filter((id) => !!id && id.trim() !== '');

        // for (const detailEvent of data.detail_events) {
        //   if (detailEvent.eventMembers?.length > 0) {
        //     for (const eventMember of detailEvent.eventMembers) {
        //       if (eventMember?.employer_branding) {
        //         await queryRunner.manager.remove(eventMember.employer_branding);
        //       }
        //     }
        //     await queryRunner.manager.remove(detailEvent.eventMembers);
        //   }
        // }

        await queryRunner.manager.remove(data.detail_events);
      }

      if (data.images?.length > 0) {
        await queryRunner.manager.remove(data.images);
      }

      if (data.links) {
        await queryRunner.manager.remove(data.links);
      }

      if (data.event_organizations?.length > 0) {
        await queryRunner.manager.remove(data.event_organizations);
      }

      await queryRunner.manager.delete(Event, id);

      if (clientIds.length > 0) {
        await openApiHelper.deleteEvent(clientIds); 
      }

      await queryRunner.commitTransaction();

      return {
        status: 'success',
        message: 'Event deleted successfully!',
      };

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Failed to delete event: ' + err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getOneDetailEvent(eventId: string, userPayload?: UserPayloadDto) {
    const relations = [
      'detail_events',
      'images',
      'event_organizations',
      'event_organizations.student_club',
      'event_organizations.student_chapter',
      'event_organizations.external_organization',
    ];
    let isRegistered = false;
    let isJoined = false;
    let joinEvent = []

    if (userPayload && (userPayload.role === 'member'||userPayload.role === 'public')) {
      const eventMember = await this.eventMemberRepository.findOne({
        where: { 
          user: { id: userPayload.sub },
          detail_event: { event: { id: eventId } }
        },
        relations: ['detail_event', 'detail_event.event'],
      });

      const registEvent = await this.eventMemberRepository.find({
        where: { 
          user: { id: userPayload.sub }, 
          detail_event: { event: { id: eventId } }},
        relations: ['detail_event', 'detail_event.event'],
        select: ['detail_event'],
      });

      joinEvent = await this.eventMemberRepository.find({
        where: { 
          user: { id: userPayload.sub }, 
          detail_event: { event: { id: eventId } },
          suggest: Not(IsNull()), attend: true, evidence_path: Not(IsNull()), duration: Not(IsNull()), material_quality: Not(IsNull()), delivery_quality: Not(IsNull()), next_topic: Not(IsNull()) },
        relations: ['detail_event', 'detail_event.event'],
        select: ['detail_event'],
      });

      isJoined = joinEvent.length > 0 && joinEvent.length == registEvent.length;
      isRegistered = !!eventMember;
    }

    if (isRegistered) {
      relations.push('links')
    }

    const detailEventIdsJoined = new Set(
      joinEvent
        .filter((em) => em.detail_event?.id)
        .map((em) => em.detail_event.id),
    );

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations,
    });

    if (!event) {
      throw new NotFoundException('Detail event not found');
    }

    const eventOrgs = event.event_organizations || [];

    const studentClubs = eventOrgs
      .filter((eo) => eo.student_club)
      .map((eo) => ({
        id: eo.student_club.id,
        name: eo.student_club.name,
        description: eo.student_club.description,
        image_url: eo.student_club.image_path
          ? `${process.env.BASE_URL_STORAGE}${eo.student_club.image_path}`
          : null,
        logo_url: eo.student_club.logo_path
          ? `${process.env.BASE_URL_STORAGE}${eo.student_club.logo_path}`
          : null,
      }));

    const studentChapters = eventOrgs
      .filter((eo) => eo.student_chapter)
      .map((eo) => ({
        id: eo.student_chapter.id,
        institute: eo.student_chapter.institute,
        address: eo.student_chapter.address,
        image_url: eo.student_chapter.image_path
          ? `${process.env.BASE_URL_STORAGE}${eo.student_chapter.image_path}`
          : null,
      }));

    const externalOrganizations = eventOrgs
      .filter((eo) => eo.external_organization)
      .map((eo) => ({
        id: eo.external_organization.id,
        name: eo.external_organization.name,
        image_url: eo.external_organization.image_path
          ? `${process.env.BASE_URL_STORAGE}${eo.external_organization.image_path}`
          : null,
      }));

    return {
      status: 'success',
      message: 'Detail event retrieved successfully!',
      data: {
        ...event,
        is_registered: isRegistered,
        is_joined: isJoined,
        detail_events: event.detail_events?.map(detail => {
          const isJoined =
            userPayload &&
            (userPayload.role === 'member' || userPayload.role === 'public')
              ? detailEventIdsJoined.has(detail.id)
              : false;

          return {
            ...detail,
            is_joined: isJoined,
            recording: isJoined ? detail.recording : null,
          };
        }) || [],
        links: (() => {
          if (!event.links) return null;
          if (userPayload && (userPayload.role === 'member'||userPayload.role === 'public')) {
            return {
              zoom: event.links.zoom,
              instagram: event.links.instagram,
            };
          }
          return event.links;
        })(),
        event_organizations: {
          student_clubs: studentClubs,
          student_chapters: studentChapters,
          external_organizations: externalOrganizations,
        },
      },
    };
  }

  async updateEvent(
    eventId: string,
    updateData: UpdateEventDto,
    files: { image?: Express.Multer.File[] },
    userPayload: UserPayloadDto
  ) {
    const openApiHelper = new CommonOpenApi();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let studentClubName = ''

    try {
      let event = await this.eventRepository.findOne({
        where: { id: eventId },
        relations: ['images', 'event_organizations', 'links', 'program', 'detail_events'],
      });
      let defaultPosterFile = null;

      if (!event) throw new NotFoundException('Event not found');

      const newOrganizations = [];

      if (updateData.student_club_ids?.length > 0) {
        const clubs = await this.studentClubRepository.find({
          where: { id: In(updateData.student_club_ids) },
        });

        studentClubName = clubs[0].name

        if (!clubs.length) throw new NotFoundException('Student clubs not found');

        newOrganizations.push(
          ...clubs.map(club =>
            this.eventOrganizationsRepository.create({ event, student_club: club })
          )
        );
      }

      if (updateData.student_chapter_ids?.length > 0) {
        const chapters = await this.studentChapterRepository.find({
          where: { id: In(updateData.student_chapter_ids) },
        });

        if (!chapters.length) throw new NotFoundException('Student chapters not found');

        newOrganizations.push(
          ...chapters.map(ch =>
            this.eventOrganizationsRepository.create({ event, student_chapter: ch })
          )
        );
      }

      if (updateData.external_organization_ids?.length > 0) {
        const externals = await this.externalOrganizationRepository.find({
          where: { id: In(updateData.external_organization_ids) },
        });

        if (!externals.length) throw new NotFoundException('External organizations not found');

        newOrganizations.push(
          ...externals.map(ex =>
            this.eventOrganizationsRepository.create({ event, external_organization: ex })
          )
        );
      }

      if (newOrganizations.length > 0) {
        await queryRunner.manager.remove(event.event_organizations);

        event.event_organizations = newOrganizations;
        await queryRunner.manager.save(newOrganizations);
      }

      if (updateData.exist_images?.length > 0) {
        for (const images of updateData.exist_images) {
          await queryRunner.manager.update(
            EventImages,
            { id: images.id },
            { activated: images.activated }
          );
        }
      }

      if (updateData.delete_images?.length > 0) {
        const deleteImageIds = updateData.delete_images.map(img => img.id);

        const imagesToDelete = event.images.filter(img => deleteImageIds.includes(img.id));

        const imagePaths = imagesToDelete.map(img => img.image_path).filter(Boolean);
        if (imagePaths.length > 0) {
          await this.uploadsService.deletesFileData(imagePaths);
        }

        await queryRunner.manager.delete(EventImages, {
          id: In(deleteImageIds),
        });
      }

      let filesData = null;

      if (files.image?.length > 0) {
        filesData = await this.uploadsService.savesFileData(files, 'events');
      } else {
        const eventImage = await await queryRunner.manager.findOne(EventImages, {where: {event: {id: eventId}, activated: true}})

        defaultPosterFile = await this.uploadsService.downloadImage(`${process.env.BASE_URL_STORAGE}${eventImage.image_path}`)
      }

      if (updateData.delete_detail_events?.length > 0) {
        for (const deleteEvent of updateData.delete_detail_events) {
          const existingDetails = await queryRunner.manager.findOne(DetailEvent, {
            where: { id: deleteEvent.id }
          });
          await openApiHelper.deleteEvent([existingDetails.id])
          await this.detailEventRepository.delete(
            { id: existingDetails.id }
          );
        }
      }

      if (updateData.program_id != event.program?.id) {
        const program = await queryRunner.manager.findOne(Programs, {
          where: { id: updateData.program_id },
        });

        if (!program) throw new NotFoundException('Program not found');

        event.program = program;
      }

      event.name = updateData.name;
      event.description = updateData.description;
      event.place = updateData.place;
      event.type = updateData.type;
      event.rules = updateData.rules;
      event.event_activate = updateData.event_activated;
      event.status = updateData.status;
      event.program_category_id = updateData.program_category_id;
      event.program_type_id = updateData.program_type_id;
      event.updated_at = new Date();
      event.updated_by = userPayload.sub;

      const savedEvent = await queryRunner.manager.save(event);

      const existingDetails = await this.detailEventRepository.find({
        where: { event: { id: savedEvent.id } },
      });

      const existingMap = new Map(existingDetails.map(d => [d.id, d]));

      if (updateData.detail_events?.length > 0) {
        for (let i = 0; i < updateData.detail_events.length; i++) {
          if (updateData.detail_events[i].id) {
            const detailEntity = existingMap.get(updateData.detail_events[i].id);
            if (!detailEntity) continue;

            detailEntity.title = updateData.detail_events[i].title;
            detailEntity.date = new Date(updateData.detail_events[i].date);
            detailEntity.start_time = updateData.detail_events[i].start_time;
            detailEntity.end_time = updateData.detail_events[i].end_time;

            const eventTmsDto: UpdateEventTmsDto = {
              id: updateData.detail_events[i].client_id || '',
              poster: files.image?.[0] || defaultPosterFile,
              budget: 0,
              ticket_price: 0,
              target_participants: 100,
              location: updateData.place,
              source_budget: 'Self Funding',
              min_age: 17,
              max_age: 56,
              participant_background: updateData.type,
              program_categories_id: updateData.program_category_id,
              program_types_id: updateData.program_type_id,
              name: updateData.detail_events[i].title,
              start_datetime: `${updateData.detail_events[i].date}T${updateData.detail_events[i].start_time}:00.000Z`,
              end_datetime: `${updateData.detail_events[i].date}T${updateData.detail_events[i].end_time}:00.000Z`,
              description: updateData.description,
              theme: studentClubName,
            }
            const data = await openApiHelper.updateEvent(eventTmsDto);
            await queryRunner.manager.save(detailEntity);

            existingMap.delete(updateData.detail_events[i].id);
          } else {
            const eventTmsDto: UpdateEventTmsDto = {
              id: updateData.detail_events[i].client_id || '',
              poster: files.image?.[0] || defaultPosterFile,
              budget: 0,
              ticket_price: 0,
              target_participants: 100,
              location: updateData.place,
              source_budget: 'Self Funding',
              min_age: 17,
              max_age: 56,
              participant_background: updateData.type,
              program_categories_id: updateData.program_category_id,
              program_types_id: updateData.program_type_id,
              name: updateData.detail_events[i].title,
              start_datetime: `${updateData.detail_events[i].date}T${updateData.detail_events[i].start_time}:00.000Z`,
              end_datetime: `${updateData.detail_events[i].date}T${updateData.detail_events[i].end_time}:00.000Z`,
              description: updateData.description,
              theme: studentClubName,
            };
            const data = await openApiHelper.createEvent(eventTmsDto);
            const created = this.detailEventRepository.create({
              title: updateData.detail_events[i].title,
              date: updateData.detail_events[i].date,
              start_time: updateData.detail_events[i].start_time,
              end_time: updateData.detail_events[i].end_time,
              client_id: data.id,
              event: savedEvent,
            });

            await queryRunner.manager.save(created);
          }
        }
      }

      const link = await this.eventLinksRepository.findOne({
        where: { event: { id: savedEvent.id } },
      });

      if (link) {
        link.zoom = updateData.zoom;
        link.instagram = updateData.instagram;
        link.term_of_reference = updateData.term_of_reference;
        await queryRunner.manager.save(link);
      } else {
        await queryRunner.manager.save(
          this.eventLinksRepository.create({
            zoom: updateData.zoom,
            instagram: updateData.instagram,
            term_of_reference: updateData.term_of_reference,
            event: savedEvent,
          })
        );
      }

      if (filesData?.images?.length > 0) {
        for (let i = 0; i < filesData.images.length; i++) {
          const meta = updateData.event_images[i];
          const file = filesData.images[i];

          const activated =
            typeof meta.activated === 'string' ? meta.activated === 'true' : meta.activated;

          const imageEntity = this.eventImagesRepository.create({
            image_path: file.filePath,
            activated,
            event: savedEvent,
          });

          await queryRunner.manager.save(imageEntity);
        }
      }

      await queryRunner.commitTransaction();

      const eventWithRelations = await this.eventRepository.findOne({
        where: { id: savedEvent.id },
        relations: [
          'links',
          'images',
          'event_organizations',
          'detail_events',
          'program',
        ],
      });

      return {
        status: 'success',
        message: 'Event updated successfully!',
        data: eventWithRelations,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Failed to update event: ${err.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async activatedEvent(eventId: string, event_activate: boolean) {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    event.event_activate = event_activate;
    event.updated_at = new Date();

    const updated = await this.eventRepository.save(event);

    return {
      status: 'success',
      message: 'Event activation status updated successfully!',
      data: updated,
    };
  }

  async updateDetailEvent(detailEventId: string, updateData: Partial<DetailEvent>) {
    const detailEvent = await this.detailEventRepository.findOne({ where: { id: detailEventId } });

    if (!detailEvent) {
      throw new NotFoundException('Detail event not found');
    }

    Object.assign(detailEvent, updateData);
    detailEvent.updated_at = new Date();

    const updated = await this.detailEventRepository.save(detailEvent);

    return {
      status: 'success',
      message: 'Detail event updated successfully!',
      data: updated,
    };
  }

  async updateDocumentation(documentationDto: EventDocumentationsDto, id: string) {
    const documentation = await this.eventDocumentationsRepository.findOne({ where: { id } });

    if (!documentation) {
      throw new NotFoundException('Documentation not found');
    }

    const targetDetailEventId = documentationDto.detail_event_id ?? documentation.detail_event.id;

    if (documentationDto.is_active === true) {
      const checkDuplicate = await this.eventDocumentationsRepository.findOne({
        where: {
          detail_event: { id: targetDetailEventId },
          is_active: true,
          id: Not(id),
        },
      });

      if (checkDuplicate) {
        throw new BadRequestException("Documentation with active status already exists for this event!");
      }

      const checkMaksimum = await this.eventDocumentationsRepository.count({where: {is_active: true}})

      if (checkMaksimum >= 6) {
        throw new BadRequestException("Maximum Capacity for Active Documentation Event!")
      }
    }

    if (documentationDto.is_big === true) {
      const checkDuplicate = await this.eventDocumentationsRepository.findOne({
        where: {
          detail_event: { id: targetDetailEventId },
          is_big: true,
          id: Not(id),
        },
      });

      if (checkDuplicate) {
        throw new BadRequestException("Big Documentation already exists for this event!");
      }

      const checkMaksimum = await this.eventDocumentationsRepository.count({where: {is_big: true}})

      if (checkMaksimum >= 6) {
        throw new BadRequestException("Maximum Capacity for Big Documentation Event!")
      }
    }

    Object.assign(documentation, documentationDto);
    const updated = await this.eventDocumentationsRepository.save(documentation);

    return {
      status: 'success',
      message: 'Documentation Event updated successfully!',
      data: updated,
    };
  }

  async updateDataDocumentation(files: { image?: Express.Multer.File[] }, id: string) {
    const documentation = await this.eventDocumentationsRepository.findOne({ where: { id } });

    if (!documentation) {
      throw new NotFoundException('Documentation not found');
    }
    let filesData = null;

    if (files.image?.length > 0) {
      await this.uploadsService.deleteFileData(documentation.image_path);

      filesData = await this.uploadsService.savesFileData(files, 'documentation_events');
    }

    const updated = await this.eventDocumentationsRepository.update(
      { id },
      { image_path: filesData.images[0].filePath }
    );

    return {
      status: 'success',
      message: 'Documentation Event updated image successfully!',
    };
  }

  async deleteDocumentation(id: string) {
    const documentation = await this.eventDocumentationsRepository.findOne({ where: { id } });

    if (!documentation) {
      throw new NotFoundException('Documentation not found');
    }

    await this.uploadsService.deleteFileData(documentation.image_path);

    const updated = await this.eventDocumentationsRepository.delete({ id });

    return {
      status: 'success',
      message: 'Documentation Event delete successfully!',
      data: updated,
    };
  }

  async createAchievement(achievementDto: AchievementDto, userPayload: UserPayloadDto) {
    const achievementUser = this.achievementRepository.create({
      ...achievementDto,
      created_at: new Date(),
      created_by: userPayload.sub
    });

    const data = await this.eventDocumentationsRepository.save(achievementUser);

    return {
      status: 'success',
      message: 'Documentation Event updated successfully!',
      data: data,
    }
  }

  async updateAchievement(achievementDto: AchievementDto, userPayload: UserPayloadDto, id: string) {
    const achieveData = await this.achievementRepository.findOne({where: {id}})

    if (!achieveData) {
      throw new BadRequestException("Achievement Not Found")
    }

    Object.assign(achieveData, achievementDto)
    achieveData.updated_at = new Date()
    achieveData.updated_by = userPayload.sub

    const updated = await this.achievementRepository.save(achieveData);

    return {
      status: 'success',
      message: 'Achievement updated successfully!',
      data: updated,
    };
  }

  async getAchievementUser(queryDto: QueryDto, userPayload: UserPayloadDto) {
    const { page = 1, limit = 10}  = queryDto;

    const [data, count] = await this.achievementRepository.findAndCount({
      where: {
        user: {
          id: userPayload.sub
        }
      },
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
      status: 'success',
      message: 'Get Achievement User successfully!',
      data,
      metaData
    };
  }
}