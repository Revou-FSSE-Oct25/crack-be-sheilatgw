import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SeriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.series.findMany({
      select: {
        series_id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  findOne(series_id: number) {
    return this.prisma.series.findUnique({
      where: { series_id },
      include: {
        products: true,
      },
    });
  }

  create(data: { name: string }) {
    const slug = data.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    return this.prisma.series.create({
      data: {
        name: data.name,
        slug,
      }
    });
  }
}