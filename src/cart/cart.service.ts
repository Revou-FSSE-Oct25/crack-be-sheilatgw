import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AddToCartDto } from './add-cart.dto';
import { UpdateCartDto } from './update-cart.dto';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService){}

    async findAll(userId: number) {
        const items = await this.prisma.cart.findMany({
            where: { userId },
            include: { product: true, },
        })

        const subtotal = items.reduce((total, item) => {
        const price = item.dpAmount ?? Number(item.product.price)

        return total + price * item.quantity
        }, 0)

        return { items, subtotal }
    }

    async add(dto: AddToCartDto, userId: number) {
        const product = await this.prisma.product.findUnique({where: { product_id: dto.productId }, });

        if (!product) {
            throw new NotFoundException("Product not found");
        }

        const stock = product.stock ?? 0

        if (product.orderType === "READY_STOCK" && dto.quantity > stock) {
            throw new BadRequestException("Stock not enough");
        }

        const existing = await this.prisma.cart.findUnique({
            where: {
            userId_productId: {
                userId,
                productId: dto.productId,
            },
            },
        });

        if (existing) {
            const newQty = existing.quantity + dto.quantity;
            const stock = product.stock ?? 0

            if (product.orderType === "READY_STOCK" && newQty > stock) {
            throw new BadRequestException("Stock not enough");
            }

            return this.prisma.cart.update({
            where: { cart_id: existing.cart_id },
            data: {
                quantity: newQty,
                dpAmount: dto.dpAmount,
            },
            });
        }

        return this.prisma.cart.create({
            data: {
            userId,
            productId: dto.productId,
            quantity: dto.quantity,
            dpAmount: dto.dpAmount,
            },
        });
    }

    async update(id: number, dto: UpdateCartDto, userId: number) {
        const cart = await this.prisma.cart.findFirst({
            where: { cart_id: id, userId },
            include: { product: true },
        });

        if (!cart) {
            throw new NotFoundException("Cart not found");
        }

        if (dto.quantity === 0) {
            return this.prisma.cart.delete({
            where: { cart_id: id },
            });
        }

        const stock = cart.product.stock ?? 0

        if (cart.product.orderType === "READY_STOCK" && dto.quantity > stock) {
            throw new BadRequestException("Stock not enough");
        }

        return this.prisma.cart.update({
            where: { cart_id: id },
            data: { quantity: dto.quantity },
        });
    }

    async remove(id: number, userId: number) {
        const cart = await this.prisma.cart.findFirst({
            where: { cart_id: id, userId },
        });

        if (!cart) {
            throw new NotFoundException("Cart not found");
        }

        return this.prisma.cart.delete({
            where: { cart_id: id },
        });
    }
}
