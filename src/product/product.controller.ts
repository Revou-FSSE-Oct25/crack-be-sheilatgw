import { Controller, Get, Param, Post, Body, Patch, ParseIntPipe, UseGuards} from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService){}

    @Get()
    async getAll(){
        return this.productService.findAll()
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
}
