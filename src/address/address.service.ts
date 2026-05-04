import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAddressDto } from './create-address.dto';
import { UpdateAddressDto } from './update-address.dto';

@Injectable()
export class AddressService {
    constructor(private prisma: PrismaService){}

    async findAll(userId: number) {
        return this.prisma.address.findMany({
            where: { userId },
            orderBy: { isDefault: "desc" }, 
        });
    }

    async findOne(id: number, userId: number) {
        const address = await this.prisma.address.findFirst({ where: { address_id: id, userId },});

        if (!address) {
            throw new NotFoundException("Address not found");
        }

        return address;
    }

    async create(dto: CreateAddressDto, userId: number){
        return this.prisma.address.create({
            data: {
                userId,
                recipientName: dto.recipientName,
                phoneNumber: dto.phoneNumber,
                fullAddress: dto.fullAddress,
                province: dto.province,
                cityRegency: dto.cityRegency,
                postalCode: dto.postalCode,
                isDefault: dto.isDefault ?? false,
            }
        })
    }

    async update(id: number, dto: UpdateAddressDto, userId: number) {
        const address = await this.prisma.address.findFirst({where: { address_id: id, userId },});

        if (!address) {
            throw new NotFoundException("Address not found");
        }

        if (dto.isDefault === true) {
            await this.prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },});
        }

        return this.prisma.address.update({
            where: { address_id: id },
            data: {
                recipientName: dto.recipientName,
                phoneNumber: dto.phoneNumber,
                fullAddress: dto.fullAddress,
                province: dto.province,
                cityRegency: dto.cityRegency,
                postalCode: dto.postalCode,
                isDefault: dto.isDefault,
            },
        });
    }

    async remove(id: number, userId: number) {
        const address = await this.findOne(id, userId);

        if (address.isDefault) {
            throw new BadRequestException("Cannot delete default address");
        }

        return this.prisma.address.delete({ where: { address_id: id },});
    }

    async setDefault(id: number, userId: number) {
        const address = await this.findOne(id, userId);

        await this.prisma.address.updateMany({
            where: { userId },
            data: { isDefault: false },
        });

        return this.prisma.address.update({
            where: { address_id: id },
            data: { isDefault: true },
        });
    }
}
