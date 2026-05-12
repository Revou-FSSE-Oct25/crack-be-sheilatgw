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

  create(data: { name: string }) {
    const slug = data.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    return this.prisma.manufacturer.create({
      data: {
        name: data.name,
        slug
      }
    });
  }
}
