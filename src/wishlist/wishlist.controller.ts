import { Controller, Get, Body, Post, Delete, Param, ParseIntPipe, UseGuards, Req,} from '@nestjs/common'
import { WishlistService } from './wishlist.service'
import { JwtAuthGuard } from 'src/auth/jwt.guard'

@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  findAll(@Req() req) {
    return this.wishlistService.findAll(req.user.id)
  }

  @Post()
 create(
  @Req() req,
  @Body('productId', ParseIntPipe) productId: number,
) {
  return this.wishlistService.create(req.user.id, productId)
}

  @Delete(':productId')
  remove(
    @Req() req,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.wishlistService.remove(req.user.id, productId)
  }
}
