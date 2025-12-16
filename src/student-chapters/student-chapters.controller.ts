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
  Res,
  UploadedFiles,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { StudentChaptersService } from './student-chapters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { StudentChapterDto } from './dto/student-chapter.dto';

@Controller('student-chapters')
export class StudentChaptersController {
  constructor(private studentChaptersService: StudentChaptersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
  ]))
  async create(
    @Req() req,
    @Res() res,
    @Body() body: StudentChapterDto,
    @UploadedFiles() files: { image?: Express.Multer.File[] }
  ) {
    const response = await this.studentChaptersService.createStudentChapter(req.user, body, files);
    res.status(HttpStatus.CREATED).json(response);
  }

  @Get()
  async findAll(@Req() req, @Res() res, @Query() query) {
    const response = await this.studentChaptersService.getAllStudentChapter(query)
    res.status(HttpStatus.OK).json(response);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const response = await this.studentChaptersService.getOneStudentChapter(id)
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
  ]))
  async updateStudentClub(
    @Param('id') id: string,
    @Res() res,
    @Body() body: StudentChapterDto,
    @UploadedFiles() files: { image?: Express.Multer.File[] }
  ) {
    const response = await this.studentChaptersService.updateStudentChapter(id, body, files);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Delete(':id')
  async deleteStudentClub(@Param('id') id: string, @Res() res) {
    const response = await this.studentChaptersService.deleteStudentChapter(id);
    res.status(HttpStatus.OK).json(response);
  }
}
