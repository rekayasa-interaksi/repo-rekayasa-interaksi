import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { MajorCampusService } from './major-campus.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { MajorCampusDto } from './dto/major-campus.dto';

@Controller('major-campus')
export class MajorCampusController {
  constructor(private majorCampusService: MajorCampusService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Post()
  async create(@Req() req, @Res() res, @Body() body: MajorCampusDto) {
    const response = await this.majorCampusService.createMajorCampus(body);
    res.status(HttpStatus.CREATED).json(response);
  }

  @Get()
  async findAll(@Req() req, @Res() res, @Query() query) {
    const response = await this.majorCampusService.getAllMajorCampus(query);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const response = await this.majorCampusService.getOneMajorCampus(id)
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Put(':id')
  async updateStudentCampus(@Param('id') id: string, @Res() res, @Body() body: MajorCampusDto) {
    const response = await this.majorCampusService.updateMajorCampus(id, body);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Delete(':id')
  async deleteStudentCampus(@Param('id') id: string, @Res() res) {
    const response = await this.majorCampusService.deleteMajorCampus(id);
    res.status(HttpStatus.OK).json(response);
  }
}
