import { BadRequestException, UseGuards, Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Patch, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { PasswordDto } from './update-password.dto';
import * as bcrypt from 'bcrypt'

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
        async getAll(){
            return this.userService.findAll();
        }
    
    @UseGuards(JwtAuthGuard)
    @Get('me')
        async getMe(@Request() req){
            return this.userService.findOne(req.user.id)
        }
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
        async getById(@Param('id', ParseIntPipe) id: number){
            return this.userService.findOne(id)
        }
    
    @UseGuards(JwtAuthGuard)
    @Patch('me')
        async updateMe(@Request() req, @Body() body: UpdateUserDto){
            return this.userService.update(req.user.id, body)
        }
    
    @UseGuards(JwtAuthGuard)
    @Patch('me/change-password')
        async changePassword(@Request() req, @Body() body: PasswordDto){
          const user = await this.userService.findOne(req.user.id)

          if(!user){
            throw new NotFoundException('User not found')
          }

          const isCurrentPasswordValid = await bcrypt.compare(body.currentPassword, user.password)
          
          if (!isCurrentPasswordValid){
            throw new BadRequestException('Wrong password')
          }

          if (body.currentPassword === body.newPassword){
            throw new BadRequestException('New password must be different from current password')
          }

          if (body.newPassword !== body.confirmPassword){
            throw new BadRequestException("Password didn't match")
          }

          return this.userService.changePassword(
            req.user.id,
            body.newPassword,
          )
        }
}
