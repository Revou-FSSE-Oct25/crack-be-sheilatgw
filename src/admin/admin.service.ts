import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { AdminDto } from './admin.dto';
import { UpdateAdminDto } from './updateAdmin.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

    findAll() {
        return this.prisma.admin.findMany();
    }

    findOne(id: number) {
        return this.prisma.admin.findUnique({
            where: { admin_id: id },
        });
    }

    async create(dto: AdminDto){
        const hashedPassword = await bcrypt.hash(dto.password, 10)

        return this.prisma.admin.create({
            data:{
                email: dto.email,
                password: hashedPassword,
                name: dto.name
            }
        })
    }

    async update(id: number, dto: UpdateAdminDto){
        const data: Prisma.AdminUpdateInput = {...dto,};

        if (dto.password) {
            data.password = await bcrypt.hash(dto.password, 10);
        }

        return this.prisma.admin.update({
            where: { admin_id: id },
            data,
        });
    }
}