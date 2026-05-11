import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';

function generatePoEstimatedMonth(poReleaseMonth?: string) {
  if (!poReleaseMonth) return undefined

  const releaseDate = new Date(`${poReleaseMonth} 1`)

  const firstEstimate = new Date(releaseDate)
  firstEstimate.setMonth(releaseDate.getMonth() + 1)

  const secondEstimate = new Date(releaseDate)
  secondEstimate.setMonth(releaseDate.getMonth() + 2)

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

    async findAll(){
        return this.prisma.product.findMany({
            include: {
                category: true,
                character: true,
                manufacturer: true,
                series: true,
            }
        })
    }

    async findOne(id: number){
        const product = await this.prisma.product.findUnique({where: {product_id: id},
            include: {
                category: true,
                character: true,
                manufacturer: true,
                series: true,
            }
        })

        if(!product){
            throw new NotFoundException("Product not found")
        }

        return product
    }

    async create(dto: CreateProductDto){
        const poEstimatedMonth = generatePoEstimatedMonth(dto.poReleaseMonth)
        const slug = dto.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')

        return this.prisma.product.create({
            data: {
                name: dto.name,
                slug,
                description: dto.description,
                price: dto.price,
                stock: dto.stock,
                orderType: dto.orderType,
                preStatus: dto.preStatus,
                poDeadline: dto.poDeadline,
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
            poDeadline: dto.poDeadline,
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
