import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderDto } from './order.dto';
import { shippingConfig } from './shipping.config';
import { OrderStatus } from 'src/generated/prisma/enums';

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
        const address = await this.prisma.address.findFirst({
            where: {address_id: dto.addressId, userId}
        })

        if(!address){
            throw new NotFoundException("Address not found")
        }

        const method = dto.shippingMethod;
        const courier = dto.courier;
        const service = dto.shippingService;
        const services = shippingConfig[method]?.[courier]

        if(!services){
            throw new NotFoundException("Invalid courier for selected method")
        }

        const selected = services.find((s) => s.service === service)

        if (!selected) {
            throw new BadRequestException("Invalid shipping service");
        }

        const subtotalPrice = 0
        const shippingCost = selected.cost
        const totalPrice = subtotalPrice + shippingCost

        return this.prisma.order.create({
            data:{
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
                subtotalPrice,
                shippingCost,
                totalPrice,
            }
        })
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
}
