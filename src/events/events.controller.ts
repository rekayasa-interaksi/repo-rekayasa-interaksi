import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  Res,
  HttpStatus,
  UploadedFiles,
  Get,
  Query,
  UseGuards,
  Delete, Param, Req,
  Patch, BadRequestException,
  Put,

} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadsService } from '../uploads/uploads.service';
import { EventsService } from './events.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public, Roles } from '../auth/decorators/roles.decorators';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DetailEvent } from './entities/detail-event.entity';
import { Event } from './entities/event.entity';
import { SendLinkMeetingDto } from './dto/send-link-meet.dto';
import { AchievementDto } from './dto/achievement.dto';
import { EventDocumentationsDto } from './dto/event-documentations.dto';
import { FeedbackEventDto } from './dto/feedback-event.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { EventsDto } from './dto/events.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { BigEventDto } from './dto/big-event.dto';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly uploadService: UploadsService
  ) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Post('')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 10 },
  ]))
  async createEvent(
    @Req() req,
    @Res() res,
    @Body() body: EventsDto,
    @UploadedFiles() files: { image?: Express.Multer.File[] }
  ) {
    if (typeof body.detail_events === 'string') {
      body.detail_events = JSON.parse(body.detail_events);
    }
    if (typeof body.event_images === 'string') {
      body.event_images = JSON.parse(body.event_images);
    }
    const response = await this.eventsService.createEvent(req.user, body, files)
    return res.status(HttpStatus.CREATED).json(response);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get()
  async getEvents(@Res() res, @Req() req, @Query() query) {
    const response = await this.eventsService.getAllEvent(query, req.user);
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('/public/documentations')
  async getDocumentations(@Res() res, @Query() query: BigEventDto) {
    const response = await this.eventsService.getActiveDocumentation(query)
    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Get('/documentations')
  async getDocumentationEvent(@Res() res, @Req() req, @Query() query: BigEventDto) {
    const response = await this.eventsService.getDocumentation(query)
    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Get('/documentations/:detail_event_id')
  async getDocumentationsyDetailEvent(@Res() res, @Param('detail_event_id') detailEventId: string, @Query() query: BigEventDto) {
    const response = await this.eventsService.getDocumentationByDetailEvent(detailEventId, query)
    return res.status(HttpStatus.OK).json(response);
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('member', 'public')
  @Post('register')
  async registerEvent(@Req() req, @Res() res, @Body() body: RegisterEventDto) {
    const response = await this.eventsService.registerEvent(body, req)
    return res.status(HttpStatus.OK).json(response)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Get('/registrants/:id')
  async eventRegistrants(@Param('id') eventId: string, @Res() res) {
    const response = await this.eventsService.getEventRegistrants(eventId);
    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Get('/feedbacks/:id')
  async eventFeedbacks(@Param('id') eventId: string, @Res() res) {
    const response = await this.eventsService.getEventFeedbacks(eventId);
    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Post('/send-link-meeting/:event_id')
  async sendLinkMeeting(@Req() req, @Res() res, @Body() body: SendLinkMeetingDto, @Param('event_id') eventId: string) {
    const response = await this.eventsService.sendLinkMeeting({ ...body, event_id: eventId });
    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('member', 'public')
  @Post('feedback')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
  ]))
  async feedbackEvent(
    @Req() req,
    @Res() res,
    @Body() body: FeedbackEventDto,
    @UploadedFiles() files: { image?: Express.Multer.File[] }
  ) {
    const response = await this.eventsService.feedbackEvent(body, req, files)
    return res.status(HttpStatus.OK).json(response)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Delete(':id')
  async deleteEvent(@Param('id') id: string, @Res() res) {
    const response = await this.eventsService.deleteEvent(id);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Patch('/activated/:id')
  async activateEvent(@Param('id') id: string, @Res() res, @Body() body) {
    const response = await this.eventsService.activatedEvent(id, body.is_active);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('member', 'public')
  @Get('history-user')
  async history(@Req() req, @Query() query, @Res() res) {
    const response = await this.eventsService.getHistoryEvent(query, req.user);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('member', 'public')
  @Get('registered-user')
  async registerUser(@Req() req, @Query() query, @Res() res) {
    const response = await this.eventsService.getRegisterEventUser(query, req.user);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('member', 'public')
  @Get('achievement-user')
  async achievementUser(@Req() req, @Query() query, @Res() res) {
    const response = await this.eventsService.getAchievementUser(query, req.user);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Patch('/documentations/activated/:id')
  async activateDocumentation(@Param('id') id: string, @Res() res, @Body() body: EventDocumentationsDto) {
    const response = await this.eventsService.updateDocumentation(body, id);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Patch('/documentations/:id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
  ]))
  async updateDocumentation(@Param('id') id: string, @Res() res, @UploadedFiles() files: { image?: Express.Multer.File[] }) {
    const response = await this.eventsService.updateDataDocumentation(files, id);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Delete('/documentations/:id')
  async deleteDocumentation(@Param('id') id: string, @Res() res) {
    const response = await this.eventsService.deleteDocumentation(id);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Post('/achievement')
  async createAchievement(@Res() res, @Body() body: AchievementDto, @Req() req) {
    const response = await this.eventsService.createAchievement(body, req.user);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Patch('/achievement/:id')
  async updateAchievement(@Param('id') id: string, @Res() res, @Body() body: AchievementDto, @Req() req) {
    const response = await this.eventsService.updateAchievement(body, req.user, id);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Get('/program-type')
  async getAllProgramType(@Res() res) {
    const response = await this.eventsService.getProgramType();
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Get('/program-category')
  async getAllProgramCategory(@Res() res) {
    const response = await this.eventsService.getProgramCategory();
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get(':id')
  async getOneDetailEvent(@Param('id') detailEventId: string, @Req() req) {
    return this.eventsService.getOneDetailEvent(detailEventId, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Post('documentations')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 10 },
  ]))
  async createDocumentationEvent(
    @Req() req,
    @Res() res,
    @Body() body,
    @UploadedFiles() files: { image?: Express.Multer.File[] }
  ) {
    if (typeof body.documentations === 'string') {
      body.documentations = JSON.parse(body.documentations);
    }

    const response = await this.eventsService.createDocumentation(body, files)
    return res.status(HttpStatus.CREATED).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 10 },
  ]))
  async updateEvent(
    @Param('id') eventId: string,
    @Body() body: UpdateEventDto,
    @UploadedFiles() files: { image?: Express.Multer.File[] },
    @Req() req,
  ) {
    return this.eventsService.updateEvent(eventId, body, files, req.user);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Patch('detail-event/:id')
  async updateDetailEvent(
    @Param('id') detailEventId: string,
    @Body() body: Partial<DetailEvent>,
  ) {
    return this.eventsService.updateDetailEvent(detailEventId, body);
  }
}
