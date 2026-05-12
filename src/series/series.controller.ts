import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import { SeriesService } from './series.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get()
  findAll() {
    return this.seriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seriesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() body: { name: string }) {
    return this.seriesService.create(body);
  }
}