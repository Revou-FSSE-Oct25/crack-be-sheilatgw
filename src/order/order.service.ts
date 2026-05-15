import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderDto } from './order.dto';
import { shippingConfig } from './shipping.config';
import { OrderStatus } from 'src/generated/prisma/enums';
import { getMinimumDP, getFullPaymentDiscount, } from 'src/common/utils/payment.util';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService){}

    async findAll(userId: number){
        return this.prisma.order.findMany({
            where: {userId},
            orderBy: {createdAt: "desc"},
            include: {
                items: {
                    include: {
                        product: true,
                    }
                }
            }
        })
    }

    async findAllAdmin(){
        return this.prisma.order.findMany({
            orderBy: { createdAt: "desc",},
            include: {user: true,
                items: {
                    include: {
                        product: true,
                    }
                }
            }
        })
    }

    async findOne(orderId: number, userId: number){
        const order = await this.prisma.order.findFirst({
            where: { order_id: orderId, userId,},
            include: {
                items: {
                    include: {
                        product: true,
                    }
                }
            }
        })

        if(!order){
            throw new NotFoundException('Order not found')
        }

        return order
    }

    async create(dto: OrderDto, userId: number){
        const address = await this.prisma.address.findFirst({where: { address_id: dto.addressId, userId }});

        if(!address){
            throw new NotFoundException("Address not found");
        }

        const method = dto.shippingMethod;
        const courier = dto.courier;
        const service = dto.shippingService;

        const services = shippingConfig[method]?.[courier];

        if(!services){
            throw new BadRequestException("Invalid courier");
        }

        const selectedService = services.find(s => s.service === service);

        if (!selectedService) {
            throw new BadRequestException("Invalid shipping service");
        }

        const shippingCost = selectedService.cost;
        const cartIds = dto.items.map(i => i.cartId);

        const cartItems = await this.prisma.cart.findMany({
            where: { userId, cart_id: { in: cartIds }},
            include: { product: true}
        });

        if(cartItems.length === 0){
            throw new BadRequestException("Cart is empty");
        }

        if (cartItems.length !== cartIds.length) {
            throw new BadRequestException("Some cart items are invalid");
        }

        let subtotal = 0;
let fullTotal = 0;
let totalDiscount = 0;
let remainingAmount = 0;

        const orderItemsData: {
            productId: number;
            quantity: number;
            price: number;
            fullPrice: number;
            discount?: number;
            productName: string;
            imageUrl?: string;
        }[] = [];

        for(const item of cartItems){
            const price = Number(item.product.price);
            const qty = item.quantity;

            if (item.product.orderType === "READY_STOCK") {
                const stock = item.product.stock ?? 0
                if (qty > stock) {
                    throw new BadRequestException(`Stock for ${item.product.name} is not enough`);
                }
            }

            const selected = dto.items.find(i => i.cartId === item.cart_id);

            if(!selected){
                throw new BadRequestException("Missing item selection");
            }

            

            if(item.product.orderType === "READY_STOCK"){
                if(item.dpAmount !== null && item.dpAmount !== undefined){
                    throw new BadRequestException("Ready stock must be full payment");
                }

                subtotal += price * qty;

                orderItemsData.push({
                    productId: item.productId,
                    quantity: qty,
                    price,
                    fullPrice: price,
                    productName: item.product.name,
                    imageUrl: item.product.imageUrl,
                });

                continue;
            }

            const dp = item.dpAmount;

            if(dp !== null && dp !== undefined){
                const minDP = getMinimumDP(price);

                if(dp < minDP){
                    throw new BadRequestException(`Minimum DP is ${minDP}`);
                }

                if(dp > price){
                    throw new BadRequestException("DP cannot exceed price");
                }

                subtotal += dp * qty;
                remainingAmount += (price - dp) * qty;

                orderItemsData.push({
                    productId: item.productId,
                    quantity: qty,
                    price: dp,
                    fullPrice: price,
                    productName: item.product.name,
                    imageUrl: item.product.imageUrl,
                });
            }

            else{
                const discount = getFullPaymentDiscount(price);
                const finalPrice = price - discount;

                subtotal += finalPrice * qty;
                totalDiscount += discount * qty;

                orderItemsData.push({
                    productId: item.productId,
                    quantity: qty,
                    price: finalPrice,
                    fullPrice: price,
                    discount,
                    productName: item.product.name,
                    imageUrl: item.product.imageUrl,
                });
            }
        }

        const totalPrice = subtotal + shippingCost;

        const order = await this.prisma.$transaction(async (tx) => {

        const createdOrder = await tx.order.create({
            data: {
                userId,
                addressId: dto.addressId,

                recipientName: address.recipientName,
                phoneNumber: address.phoneNumber,
                fullAddress: address.fullAddress,
                province: address.province,
                cityRegency: address.cityRegency,
                postalCode: address.postalCode,

                shippingMethod: method,
                courier,
                shippingService: service,
                paymentMethod: dto.paymentMethod,

                subtotalPrice: subtotal,
                shippingCost,
                totalPrice,
                remainingAmount,
                totalDiscount: totalDiscount || 0,

                items: {create: orderItemsData},}});

        for (const item of cartItems) {
            if (item.product.orderType === "READY_STOCK") {
                await tx.product.update({
                    where: { product_id: item.productId,  stock: { gte: item.quantity }},
                    data: {stock: {decrement: item.quantity}}
                });
              }
        }

        await tx.cart.deleteMany({
            where: { userId, cart_id: { in: cartIds }}
        });

        return createdOrder;
    });

    return order

}

    async updateStatus(orderId: number, status: OrderStatus){
        const order = await this.prisma.order.findUnique({ where: {order_id: orderId},})

        if(!order){
            throw new NotFoundException("Order not found")
        }

        return this.prisma.order.update({
            where: {order_id: orderId}, data: {status}
        })
    }

    async cancel(orderId: number, userId: number){
        const order = await this.prisma.order.findFirst({where: {order_id: orderId, userId}})

        if(!order){
            throw new NotFoundException("Order not found")
        }

        if(order.status !== "PENDING_PAYMENT"){
            throw new BadRequestException("Cannot cancel this order")
        }

        return this.prisma.order.update({
            where: { order_id: orderId},
            data: { status: "CANCELLED"},
        })
    }

    async payRemaining(orderId: number, userId: number){
        const order = await this.prisma.order.findFirst({where: { order_id: orderId, userId }});

        if(!order){
            throw new NotFoundException("Order not found");
        }

        if(order.remainingAmount <= 0){
            throw new BadRequestException("Order already fully paid");
        }

        return this.prisma.order.update({
            where: { order_id: orderId },
            data: {
                totalPrice: order.totalPrice + order.remainingAmount,
                remainingAmount: 0,
                status: "PAID"
            }
        });
    }
}
