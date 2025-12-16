import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ProgramsAlumniService } from './programs-alumni.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { ProgramAlumniDto } from './dto/program-alumni.dto';

@Controller('programs-alumni')
export class ProgramsAlumniController {
  constructor(private programsAlumniService: ProgramsAlumniService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Post()
  async create(@Req() req, @Res() res, @Body() body: ProgramAlumniDto) {
    const response = await this.programsAlumniService.createProgramAlumni(body);
    res.status(HttpStatus.CREATED).json(response);
  }

  @Get()
  async findAll(@Req() req, @Res() res, @Query() query) {
    const response = await this.programsAlumniService.getAllProgramAlumni(query)
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const response = await this.programsAlumniService.getOneProgramAlumni(id)
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Put(':id')
  async updateStudentClub(@Param('id') id: string, @Res() res, @Body() body: ProgramAlumniDto) {
    const response = await this.programsAlumniService.updateProgramAlumni(id, body);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Delete(':id')
  async deleteStudentClub(@Param('id') id: string, @Res() res) {
    const response = await this.programsAlumniService.deleteProgramAlumni(id);
    res.status(HttpStatus.OK).json(response);
  }
}
