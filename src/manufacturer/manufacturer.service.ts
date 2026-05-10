import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ManufacturerService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.manufacturer.findMany({
        select: {
        manuf_id: true,
        name: true,
        slug: true,
        },
        orderBy: {
        name: 'asc',
        },
    });
    }

  findOne(manuf_id: number) {
    return this.prisma.manufacturer.findUnique({
      where: { manuf_id },
      include: {
        products: true,
      },
    });
  }

  create(data: { name: string; slug: string }) {
    return this.prisma.manufacturer.create({
      data,
    });
  }
}
