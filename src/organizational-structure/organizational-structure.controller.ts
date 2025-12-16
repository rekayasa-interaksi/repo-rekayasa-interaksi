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
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { OrganizationalStructureService } from './organizational-structure.service';
import { CreateOrganizationalStructureDto } from './dto/create-org-structure.dto';
import { UpdateOrganizationalStructureDto } from './dto/update-org-structure.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ParseJsonPipe } from 'src/helpers/parse-json';
import { plainToClass } from 'class-transformer';
import { SocialMediaDto } from './dto/social-media.dto';

@Controller('organizational-structure')
export class OrganizationalStructureController {
  constructor(private readonly organizationalStructureService: OrganizationalStructureService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
  ]))
  async create(
    @Req() req,
    @Body() body: any,
    @Body('social_media', ParseJsonPipe) socialMedia: any,
    @UploadedFiles() files: { image?: Express.Multer.File[] }
  ) {
    body.social_media = socialMedia;
    const dto = plainToClass(CreateOrganizationalStructureDto, body);
    const data  =  await this.organizationalStructureService.create(req.user, dto, files)

    return data
  }

  @Get()
  async findAll(@Query('generation') generation?: string) {
    const data = await this.organizationalStructureService.findAll(generation);

    return data
  }

  @Get('generations')
  async getGenerations() {
    const data = await this.organizationalStructureService.getGenerations();

    return data
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.organizationalStructureService.findOne(id);

    return data
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
  ]))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationalStructureDto,
    @UploadedFiles() files: { image?: Express.Multer.File[] }
  ) {
    const data = await this.organizationalStructureService.update(id, dto, files);

    return data
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.organizationalStructureService.remove(id);

    return deleted
  }
}
