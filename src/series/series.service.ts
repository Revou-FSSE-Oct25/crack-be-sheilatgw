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

  create(data: { name: string; slug: string }) {
    return this.prisma.series.create({
      data,
    });
  }
}