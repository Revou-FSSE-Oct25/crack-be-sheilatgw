import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './category.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService){}

    @Get()
    async getAll(){
        return this.categoryService.findAll()
    }

    @Get('Tree')
    async getTree(){
        return this.categoryService.getTree()
    }

    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async create(@Body() dto: CategoryDto){
        return this.categoryService.create(dto)
    }
}
