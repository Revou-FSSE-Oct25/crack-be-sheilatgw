import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';

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
