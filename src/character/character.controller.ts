import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CharacterService } from './character.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  findAll() {
    return this.characterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.characterService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() body: { name: string; slug: string }) {
    return this.characterService.create(body);
  }
}
