import { Controller, Post, Body, Get, Res, Query, HttpStatus, Put, Param, UseGuards, Req, UploadedFiles, UseInterceptors, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public, Roles } from '../auth/decorators/roles.decorators';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SendOtpDto } from './dto/send-otp.dto';
import { LoggingRequestDto } from './dto/logging-request';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyOtpDto } from './dto/email-verification.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { DeleteImageDto } from './dto/delete-image-dto';
import { DomisiliDto } from './dto/domisili.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createMemberDto: CreateMemberDto) {
    return this.usersService.createMember(createMemberDto);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Post('logging')
  async createLogging(@Req() req, @Res() res, @Body() body: LoggingRequestDto) {
    const response = await this.usersService.createLogging(body, req.user);
    res.status(HttpStatus.CREATED).json(response)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Put('validate-member/:unique_number')
  async validateMember(@Param('unique_number') unique_number: string, @Res() res) {
    const response = await this.usersService.validateMember(unique_number);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Put('default-password')
  async genDefaultPass(@Body() body, @Res() res) {
    const response = await this.usersService.generateDefaultPassword(body.users_id);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('member', 'public')
  @Put('reset-password')
  async resetPassword(@Req() req, @Body() body: ResetPasswordDto, @Res() res) {
    const response = await this.usersService.resetPassword(req, body);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('member', 'public')
  @Get('checking-data-user')
  async checkingDataUser(@Req() req, @Res() res) {
    const response = await this.usersService.checkDataUser(req.user);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('member', 'public')
  @Put('update-profile')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image_profile', maxCount: 1 },
    { name: 'image_cover', maxCount: 1 },
  ]))
  async updateProfileUser(
    @Req() req,
    @Res() res,
    @Body() body: UpdateUserDto,
    @UploadedFiles() files: { image_profile?: Express.Multer.File[]; image_cover?: Express.Multer.File[] }
  ) {
    const response = await this.usersService.updateProfileUser(req, body, files);
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('validate-member')
  async checkUniqueMember(@Query() query, @Res() res) {
    const response = await this.usersService.checkUniqueMember(query);
    res.status(HttpStatus.OK).json(response);
  }

  @Post('send-otp')
  async emailVerification(@Body() body: SendOtpDto, @Res() res) {
    const response = await this.usersService.generateEmailVerificationToken(body);
    res.status(HttpStatus.OK).json(response);
  }

  @Post('verify-otp')
  async verifyEmail(@Body() body: VerifyOtpDto, @Res() res) {
    const response = await this.usersService.verifyEmailToken(body);
    res.status(HttpStatus.OK).json(response);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto, @Res() res) {
    const response = await this.usersService.forgotPassword(body);
    res.status(HttpStatus.OK).json(response);
  }

  @Post('validation-account/:id')
  async validationAccount(@Res() res, @Param('id') id: string) {
    const response = await this.usersService.validationAccount(id);
    res.status(HttpStatus.OK).json(response);
  }

  @Get('account-information')
  async getAccountInformation(@Res() res, @Query() query) {
    const response = await this.usersService.accountInformation(query);
    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Get('')
  async getAll(@Res() res, @Query() query) {
    const response = await this.usersService.getAllUser(query);
    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Get('data-monitoring-admin')
  async getAllDataMonitoring(@Res() res) {
    const response = await this.usersService.allDataMonitoring();
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('data-monitoring')
  async getDataMonitoring(@Res() res) {
    const response = await this.usersService.dataMonitoring();
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('/public-information')
  async getPublicUser(@Res() res, @Query() query) {
    const response = await this.usersService.getPublicInformationUser(query);
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('domisili')
  async getAllDomisili(@Res() res, @Query() query) {
    const response = await this.usersService.getAllDomisili(query);
    return res.status(HttpStatus.OK).json(response)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Post('domisili')
  async createDomisili(@Res() res, @Body() body: DomisiliDto) {
    const response = await this.usersService.createDomisili(body);
    res.status(HttpStatus.CREATED).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Get('domisili/:id')
  async findOneDomisili(@Param('id') id: string, @Res() res) {
    const response = await this.usersService.getOneDomisili(id)
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Put('domisili/:id')
  async updateDomisili(@Param('id') id: string, @Res() res, @Body() body: DomisiliDto) {
    const response = await this.usersService.updateDomisili(id, body);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Delete('domisili/:id')
  async deleteDomisili(@Param('id') id: string, @Res() res) {
    const response = await this.usersService.deleteDomisili(id);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('member', 'public')
  @Patch('image/delete')
  async deleteImage(@Res() res, @Req() req, @Body() body: DeleteImageDto) {
    const response = await this.usersService.deleteImageUser(req.user, body);
    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('member', 'public')
  @Get('profile')
  async getOne(@Res() res, @Req() req) {
    const response = await this.usersService.getProfileUser(req)
    return res.status(HttpStatus.OK).json(response)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('member', 'public')
  @Get('registered-event')
  async registeredEvent(@Res() res, @Query() query, @Req() req) {
    const response = await this.usersService.registeredEventUser(req, query)
    return res.status(HttpStatus.OK).json(response)
  }
}
