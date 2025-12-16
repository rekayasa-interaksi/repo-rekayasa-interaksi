import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { ProgramsDto } from './dto/programs.dto';

@Controller('programs')
export class ProgramsController {
  constructor(private programsService: ProgramsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Post()
  async create(@Req() req, @Res() res, @Body() body: ProgramsDto) {
    const response = await this.programsService.createPrograms(body);
    res.status(HttpStatus.CREATED).json(response);
  }

  @Get()
  async findAll(@Req() req, @Res() res, @Query() query) {
    const response = await this.programsService.getAllPrograms(query)
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const response = await this.programsService.getOnePrograms(id)
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Put(':id')
  async updateStudentClub(@Param('id') id: string, @Res() res, @Body() body: ProgramsDto) {
    const response = await this.programsService.updatePrograms(id, body);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Delete(':id')
  async deleteStudentClub(@Param('id') id: string, @Res() res) {
    const response = await this.programsService.deletePrograms(id);
    res.status(HttpStatus.OK).json(response);
  }
}
