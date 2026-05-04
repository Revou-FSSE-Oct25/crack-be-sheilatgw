import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { CategoryDto } from './category.dto';


@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService){}

    async create(dto: CategoryDto){
        const slug = dto.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")

        return this.prisma.category.create({
            data:{
                name: dto.name,
                slug,
                parentId: dto.parentId
            }
        })
    }

    async findAll(){
        return this.prisma.category.findMany()
    }

    async findOne(id: number){
        const category = this.prisma.category.findUnique({
            where: {category_id: id},
            include: {
                parent: true,
                children: true,
            }
        })

        if(!category){
            throw new NotFoundException("Category not found")
        }

        return category
    }

    async getTree() {
        return this.prisma.category.findMany({
            where: { parentId: null },
            select: {
                category_id: true,
                name: true,
                children: {
                    select: {
                        category_id: true,
                        name: true,
                    },
                },
            },
        });
    }
    
}
