import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus, Query,
} from '@nestjs/common';
  import { FaqService } from './faq.service';
  import { CreateFaqDto } from './dto/create-faq.dto';
  import { UpdateFaqDto } from './dto/update-faq.dto';
  import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/auth/guards/roles.guard';
  import { Roles } from 'src/auth/decorators/roles.decorators';
import { AnswerFaqDto } from './dto/answer-faq.dto';
  
  @Controller('faq')
  export class FaqController {
    constructor(private readonly faqService: FaqService) {}
  
    @Get()
    async findAll(@Res() res, @Query() query) {
      const faqs = await this.faqService.findAll(query);
      return res.status(HttpStatus.OK).json(faqs);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res) {
      const faq = await this.faqService.findOne(id);
      return res.status(HttpStatus.OK).json({ message: 'FAQ found', data: faq });
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('superadmin')
    @Post()
    async create(@Body() dto: CreateFaqDto, @Res() res) {
      const faq = await this.faqService.create(dto);
      return res.status(HttpStatus.CREATED).json({ message: 'FAQ created successfully', data: faq });
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('superadmin')
    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateFaqDto, @Res() res) {
      const faq = await this.faqService.update(id, dto);
      return res.status(HttpStatus.OK).json({ message: 'FAQ updated successfully', data: faq });
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('superadmin')
    @Patch('answer/:id')
    async answerFaq(@Param('id') id: string, @Body() dto: AnswerFaqDto, @Res() res) {
      const faq = await this.faqService.answerQuestion(id, dto);
      return res.status(HttpStatus.OK).json({ message: 'FAQ answer successfully', data: faq });
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('superadmin')
    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res) {
      const result = await this.faqService.remove(id);
      return res.status(HttpStatus.OK).json(result);
    }
  }
  