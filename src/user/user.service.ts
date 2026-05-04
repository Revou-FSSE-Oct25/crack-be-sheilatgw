import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { UpdateUserDto } from './update-user.dto';
import { PasswordDto } from './update-password.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    findAll(){
        return this.prisma.user.findMany()
    }

    findOne(id: number){
        return this.prisma.user.findUnique({where: {user_id: id},});
    }

    async update(id: number, dto: UpdateUserDto){
        const data: Prisma.UserUpdateInput = {...dto}

        return this.prisma.user.update({
            where: {user_id: id},
            data,
        })
    }

    async changePassword(id: number, newPassword: string){
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        return this.prisma.user.update({
            where: {user_id: id},
            data:{
                password: hashedPassword
            }
        })
    }
}
