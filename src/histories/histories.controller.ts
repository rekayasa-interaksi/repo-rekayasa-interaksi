import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Put,
  UploadedFiles, Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { QueryHistoryDto } from './dto/query-history.dto';

@Controller('histories')
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
  ]))
  async create(
    @Req() req,
    @Res() res,
    @Body() dto: CreateHistoryDto,
    @UploadedFiles() files: { image?: Express.Multer.File[] }
  ) {
    const data  =  await this.historiesService.create(req.user, dto, files)

    return res.status(HttpStatus.CREATED).json(data);
  }

  @Get()
  async findAll(@Query() queryDto: QueryHistoryDto, @Res() res) {
    const data = await this.historiesService.findAll(queryDto);
    return res.status(HttpStatus.OK).json(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const data = await this.historiesService.findOne(id);

    return res.status(HttpStatus.OK).json(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
  ]))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateHistoryDto,
    @Res() res,
    @UploadedFiles() files: { image?: Express.Multer.File[] }
  ) {
    const data = await this.historiesService.update(id, dto, files);

    return res.status(HttpStatus.OK).json(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    const deleted = await this.historiesService.remove(id);

    return res.status(HttpStatus.OK).json(deleted);
  }
}
