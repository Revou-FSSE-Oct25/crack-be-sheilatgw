import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';
import { getMinimumDP, getFullPaymentDiscount } from 'src/common/utils/payment.util';

function generatePoEstimatedMonth(poReleaseMonth?: string) {
  if (!poReleaseMonth) return undefined

  const releaseDate = new Date(`${poReleaseMonth} 1`)

  if (isNaN(releaseDate.getTime())) return undefined

  const firstEstimate = new Date(releaseDate)
    firstEstimate.setMonth(firstEstimate.getMonth() + 1)

    const secondEstimate = new Date(releaseDate)
    secondEstimate.setMonth(secondEstimate.getMonth() + 2)

    const firstMonth = firstEstimate.toLocaleDateString("en-US", {
        month: "long",
    })

    const secondMonth = secondEstimate.toLocaleDateString("en-US", {
        month: "long",
    })

    const year = secondEstimate.getFullYear()

    return `${firstMonth}-${secondMonth} ${year}`
    }

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    async findAll(search?: string) {
        const products = await this.prisma.product.findMany({
            where: search
            ? {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
                }
            : undefined,

            include: {
            category: true,
            character: true,
            manufacturer: true,
            series: true,
            },
        })

        return products.map((product) => {
            const price = Number(product.price)
            const isPO = product.orderType === "PO"

            const fullPaymentDiscount = isPO
            ? getFullPaymentDiscount(price)
            : null

            return {
            ...product,
            minimumDP: isPO ? getMinimumDP(price) : null,
            fullPaymentDiscount,
            fullPaymentPrice:
                isPO && fullPaymentDiscount !== null
                ? price - fullPaymentDiscount
                : null,
            }
        })
    }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { product_id: id },
            include: {
            category: true,
            character: true,
            manufacturer: true,
            series: true,
            },
        })

        if (!product) {
            throw new NotFoundException('Product not found')
        }

        const price = Number(product.price)
        const isPO = product.orderType === 'PO'

        const fullPaymentDiscount = isPO
            ? getFullPaymentDiscount(price)
            : null

        return {
            ...product,
            minimumDP: isPO ? getMinimumDP(price) : null,
            fullPaymentDiscount,
            fullPaymentPrice:
            isPO && fullPaymentDiscount !== null
                ? price - fullPaymentDiscount
                : null,
        }
    }

    async create(dto: CreateProductDto){
        if (dto.orderType === 'READY_STOCK' && dto.stock == null) {
        throw new BadRequestException(
            'Stock is required for ready stock products',
        )
        }
        const poEstimatedMonth = generatePoEstimatedMonth(dto.poReleaseMonth)
        const slug = dto.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')

        return this.prisma.product.create({
            data: {
                name: dto.name,
                slug,
                description: dto.description,
                price: dto.price,
                ...(dto.stock !== undefined && { stock: dto.stock }),
                orderType: dto.orderType,
                preStatus: dto.preStatus,
                poDeadline: dto.poDeadline ? new Date(dto.poDeadline) : null,
                isSoldOut: dto.isSoldOut ?? false,
                poReleaseMonth: dto.poReleaseMonth,
                poEstimatedMonth,
                imageUrl: dto.imageUrl,
                categoryId: dto.categoryId,
                characterId: dto.characterId,
                seriesId: dto.seriesId,
                manufacturerId: dto.manufacturerId,
            },
        })
    }

    async update(id: number, dto: UpdateProductDto) {
        await this.findOne(id);

        const poEstimatedMonth = dto.poReleaseMonth ? generatePoEstimatedMonth(dto.poReleaseMonth) : undefined
        const slug = dto.name ? dto.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') : undefined;

        return this.prisma.product.update({
            where: { product_id: id },
            data: {
            name: dto.name,
            slug,
            description: dto.description,
            price: dto.price,
            stock: dto.stock,
            orderType: dto.orderType,
            preStatus: dto.preStatus,
            poDeadline: dto.poDeadline ? new Date(dto.poDeadline) : undefined,
            poReleaseMonth: dto.poReleaseMonth,
            poEstimatedMonth,
            isSoldOut: dto.isSoldOut,
            imageUrl: dto.imageUrl,
            categoryId: dto.categoryId,
            characterId: dto.characterId,
            seriesId: dto.seriesId,
            manufacturerId: dto.manufacturerId,
            },
        });
    }

    async remove(id:number){
        await this.findOne(id)

        return this.prisma.product.delete({
            where: {product_id: id},
        })
    }
    
}
