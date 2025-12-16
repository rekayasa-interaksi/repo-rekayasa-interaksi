import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { RolesDto } from './dto/roles.dto';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Post()
  async create(@Req() req, @Res() res, @Body() body: RolesDto) {
    const response = await this.rolesService.createRoles(body);
    res.status(HttpStatus.CREATED).json(response);
  }

  @Get()
  async findAll(@Req() req, @Res() res, @Body() body) {
    const response = await this.rolesService.getAllRoles()
    res.status(HttpStatus.OK).json(response);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const response = await this.rolesService.getOneRoles(id)
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Put(':id')
  async updateRoles(@Param('id') id: string, @Res() res, @Body() body: RolesDto) {
    const response = await this.rolesService.updateRoles(id, body);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Delete(':id')
  async deleteRoles(@Param('id') id: string, @Res() res) {
    const response = await this.rolesService.deleteRoles(id);
    res.status(HttpStatus.OK).json(response);
  }
}
