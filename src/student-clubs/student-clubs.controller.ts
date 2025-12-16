import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res, UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StudentClubsService } from './student-clubs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { StudentClubDto } from './dto/student-club.dto';

@Controller('student-clubs')
export class StudentClubsController {
  constructor(private studentClubsService: StudentClubsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'logo', maxCount: 1 }
  ]))
  async create(
    @Req() req,
    @Res() res,
    @Body() body: StudentClubDto,
    @UploadedFiles() files: { image?: Express.Multer.File[], logo?: Express.Multer.File[] }
  ) {
    const response = await this.studentClubsService.createStudentClub(req.user, body, files);
    res.status(HttpStatus.CREATED).json(response);
  }

  @Get()
  async findAll(@Req() req, @Res() res, @Query() query) {
    const response = await this.studentClubsService.getAllStudentClub(query)
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const response = await this.studentClubsService.getOneStudentClub(id)
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]))
  async updateStudentClub(
    @Param('id') id: string,
    @Res() res,
    @Body() body: StudentClubDto,
    @UploadedFiles() files: { image?: Express.Multer.File[], logo?: Express.Multer.File[] }
  ) {
    const response = await this.studentClubsService.updateStudentClub(id, body, files);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Delete(':id')
  async deleteStudentClub(@Param('id') id: string, @Res() res) {
    const response = await this.studentClubsService.deleteStudentClub(id);
    res.status(HttpStatus.OK).json(response);
  }
}
