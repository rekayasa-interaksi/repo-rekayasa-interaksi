import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { HelpCentersService } from './help-centers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public, Roles } from '../auth/decorators/roles.decorators';
import { HelpCenterDto } from './dto/help-centers.dto';
import { AnswerDto } from './dto/answer.dto';

@Controller('help-centers')
export class HelpCentersController {
  constructor(private helpCentersService: HelpCentersService) {}

  @UseGuards(JwtAuthGuard)
  @Public()
  @Post()
  async create(@Req() req, @Res() res, @Body() body: HelpCenterDto) {
    const response = await this.helpCentersService.createHelpCenter(req.user, body);
    res.status(HttpStatus.CREATED).json(response);
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Get()
  async findAll(@Req() req, @Res() res, @Query() query) {
    const response = await this.helpCentersService.getAllHelpCenters(query);
    res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Put(':id')
  async updateHelpCenter(@Param('id') id: string, @Res() res, @Req() req, @Body() body: AnswerDto) {
    const response = await this.helpCentersService.updateHelpCenter(id, true, body, req.user);
    res.status(HttpStatus.OK).json(response);
  }
}
