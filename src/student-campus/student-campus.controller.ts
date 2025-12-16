import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { StudentCampusService } from './student-campus.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { StudentCampusDto } from './dto/student-campus.dto';

@Controller('student-campus')
export class StudentCampusController {
  constructor(private studentCampusService: StudentCampusService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Post()
  async create(@Res() res, @Body() body: StudentCampusDto) {
    const response = await this.studentCampusService.createStudentCampus(body);
    res.status(HttpStatus.CREATED).json(response);
  }

  @Get()
  async findAll(@Req() req, @Res() res, @Query() query) {
    const response = await this.studentCampusService.getAllStudentCampus(query)
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const response = await this.studentCampusService.getOneStudentCampus(id)
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Put(':id')
  async updateStudentCampus(@Param('id') id: string, @Res() res, @Body() body: StudentCampusDto) {
    const response = await this.studentCampusService.updateStudentCampus(id, body);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Delete(':id')
  async deleteStudentCampus(@Param('id') id: string, @Res() res) {
    const response = await this.studentCampusService.deleteStudentCampus(id);
    res.status(HttpStatus.OK).json(response);
  }
}
