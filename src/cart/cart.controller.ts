import { Controller, Post, UseGuards, Get, Patch, Delete, Param, Body, Req, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './add-cart.dto';
import { UpdateCartDto } from './update-cart.dto';


@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getCart(@Req() req) {
    return this.cartService.findAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  add(@Body() dto: AddToCartDto, @Req() req) {
    return this.cartService.add(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartDto,
    @Req() req
  ) {
    return this.cartService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.cartService.remove(id, req.user.id);
  }
}
