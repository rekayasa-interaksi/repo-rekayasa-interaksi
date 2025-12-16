import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    HttpStatus,
    HttpException,
    UseGuards, UseInterceptors, UploadedFiles, Req,
    Query,
    Res,
} from '@nestjs/common';
import { ExternalOrganizationService } from './external-organization.service';
import { CreateExternalDto } from './dto/create-external-organization.dto';
import { UpdateExternalDto } from './dto/update-external-organization.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('external-organization')
export class ExternalOrganizationController {
    constructor(private readonly externalOrganizationService: ExternalOrganizationService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superadmin')
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 },
    ]))
    async create(
      @Req() req,
      @Res() res,
      @Body() createDto: CreateExternalDto,
      @UploadedFiles() files: { image?: Express.Multer.File[] }
    ) {
        const data = await this.externalOrganizationService.createExternalOrganization(req.user, createDto, files);
        return res.status(HttpStatus.CREATED).json(data);
    }

    @Get()
    async findAll(@Res() res, @Query() query) {
        const data = await this.externalOrganizationService.getAllExternalOrganizations(query);
        return res.status(HttpStatus.OK).json(data);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res) {
        const data = await this.externalOrganizationService.getExternalOrganizationById(id);
        return res.status(HttpStatus.OK).json(data);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superadmin')
    @Put(':id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image', maxCount: 1 },
    ]))
    async update(
      @Param('id') id: string,
      @Res() res,
      @Body() updateDto: UpdateExternalDto,
      @UploadedFiles() files: { image?: Express.Multer.File[] }
    ) {
        const data = await this.externalOrganizationService.updateExternalOrganization(id, updateDto, files);
        return res.status(HttpStatus.OK).json(data);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'superadmin')
    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res) {
        const deleted = await this.externalOrganizationService.deleteExternalOrganization(id);
        return res.status(HttpStatus.OK).json(deleted);
    }
}
