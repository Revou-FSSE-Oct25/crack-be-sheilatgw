import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CharacterService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.character.findMany({
      select: {
        chara_id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  findOne(chara_id: number) {
    return this.prisma.character.findUnique({
      where: { chara_id },
      include: { products: true },
    });
  }

  create(data: { name: string }) {
    const slug = data.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    return this.prisma.character.create({ 
      data: {
        name: data.name,
       slug,
      } });
  }
}