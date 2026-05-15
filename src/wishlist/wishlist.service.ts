import { Injectable, NotFoundException, ConflictException,} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { getMinimumDP, getFullPaymentDiscount } from 'src/common/utils/payment.util'

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
  const items = await this.prisma.wishlist.findMany({
    where: { userId },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return items.map((item) => {
    const price = Number(item.product.price)
    const isPO = item.product.orderType === 'PO'

    const fullPaymentDiscount = isPO
      ? getFullPaymentDiscount(price)
      : null

    return {
      ...item,
      product: {
        ...item.product,
        minimumDP: isPO ? getMinimumDP(price) : null,
        fullPaymentDiscount,
        fullPaymentPrice:
          isPO && fullPaymentDiscount !== null
            ? price - fullPaymentDiscount
            : null,
      },
    }
  })
}

  async create(userId: number, productId: number) {
    const existing = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })

    if (existing) {
      throw new ConflictException('Product already in wishlist')
    }

    return this.prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    })
  }

  async remove(userId: number, productId: number) {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found')
    }

    await this.prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })

    return {
      message: 'Wishlist removed',
    }
  }
}