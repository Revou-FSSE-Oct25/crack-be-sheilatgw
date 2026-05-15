import { Controller, Get, Delete, Param, Post, Body, Query, Patch, ParseIntPipe, UseGuards} from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService){}

    @Get()
    async getAll(@Query("search") search?: string) {
        return this.productService.findAll(search)
    }

    @Get(':id')
    async getProduct(@Param('id', ParseIntPipe) id: number){
        return this.productService.findOne(id)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async createProduct(@Body() add: CreateProductDto){
        return this.productService.create(add)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    async updateProduct(@Param('id', ParseIntPipe) id: number, @Body() edit: UpdateProductDto){
        return this.productService.update(id, edit)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteProduct(@Param('id', ParseIntPipe) id: number,){
        return this.productService.remove(id)
    }
}
