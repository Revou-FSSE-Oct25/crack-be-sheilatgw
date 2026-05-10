import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import { ManufacturerService } from './manufacturer.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('manufacturers')
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Get()
  findAll() {
    return this.manufacturerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manufacturerService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() body: { name: string; slug: string }) {
    return this.manufacturerService.create(body);
  }
}