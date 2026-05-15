import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminDto } from './admin.dto';
import { UpdateAdminDto } from './updateAdmin.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    
    @Post()
    create(@Body() dto: AdminDto) {
        return this.adminService.create(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    findAll() {
        return this.adminService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@Req() req) {
        return this.adminService.findOne(req.user.id)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.adminService.findOne(Number(id));
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
        return this.adminService.update(Number(id), dto);
    }

}
