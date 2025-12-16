import { Controller, Post, Body, UseGuards, Req, UseInterceptors, UploadedFiles, Get, Param, Put, Delete, Query } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public, Roles } from 'src/auth/decorators/roles.decorators';
import { CreateTeamDto } from './dto/create-team.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { QueryTeamDto } from './dto/query-team.dto';
import { CreateVersionDto } from './dto/create-version.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Post('')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
  ]))
  async createTeammate(@Body() createTeamDto: CreateTeamDto, @Req() req, @UploadedFiles() files: { image?: Express.Multer.File[] }) {
    return this.teamsService.createTeam(createTeamDto, req.user, files);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
  ]))
  async updateTeam(@Param('id') id: string, @Body() updateTeamDto: CreateTeamDto, @Req() req, @UploadedFiles() files: { image?: Express.Multer.File[] }) {
    return this.teamsService.updateTeam(id, updateTeamDto, req.user, files);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Delete(':id')
  async deleteTeam(@Param('id') id: string) {
    return this.teamsService.deleteTeam(id);
  }

  @Get('generations')
  async getAllGenerations() {
    return this.teamsService.getGenerations();
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get('')
  async getAllTeams(@Query() query: QueryTeamDto, @Req() req) {
    return this.teamsService.getAllTeams(query, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Post('version-systems')
  async createVersionSystem(@Body() versionDto: CreateVersionDto, @Req() req) {
    return this.teamsService.createVersionSystem(versionDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Put('version-systems/:id')
  async updateVersionSystem(@Param('id') id: string, @Body() versionDto: CreateVersionDto, @Req() req) {
    return this.teamsService.updateVersionSystem(id, versionDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Delete('version-systems/:id')
  async deleteVersionSystem(@Param('id') id: string) {
    return this.teamsService.deleteVersionSystem(id);
  }

  @Get('version-systems')
  async getAllVersionSystems(@Query() query: QueryTeamDto) {
    return this.teamsService.getVersionSystems(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Post('features')
  async createFeature(@Body() featureDto: CreateFeatureDto, @Req() req) {
    return this.teamsService.createFeature(featureDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Put('features/:id')
  async updateFeature(@Param('id') id: string, @Body() featureDto: CreateFeatureDto, @Req() req) {
    return this.teamsService.updateFeature(id, featureDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Delete('features/:id')
  async deleteFeature(@Param('id') id: string) {
    return this.teamsService.deleteFeature(id);
  }

  @Get('features')
  async getAllFeatures(@Query() query: QueryTeamDto) {
    return this.teamsService.getFeatures(query);
  }

  @Get('features/:id')
  async getOneFeature(@Param('id') id: string) {
    return this.teamsService.getOneFeature(id);
  }
}
