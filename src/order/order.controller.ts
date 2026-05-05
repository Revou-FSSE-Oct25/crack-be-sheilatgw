import { Controller, UseGuards, Get, Req, Param, Body, Post, Patch, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { OrderDto } from './order.dto';
import { OrderStatus } from 'src/generated/prisma/enums';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService){}

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(@Req() req){
        return this.orderService.findAll(req.user.id)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('admin/all')
    getOrders(){
        return this.orderService.findAllAdmin()
    }
    
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id: number,@Req() req){
        return this.orderService.findOne(id, req.user.id)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: OrderDto, @Req() req){
        return this.orderService.create(dto, req.user.id)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id/status')
    updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: OrderStatus){
        return this.orderService.updateStatus(id, status)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/cancel')
    cancel(@Param('id', ParseIntPipe) id: number, @Req() req){
        return this.orderService.cancel(id, req.user.id)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/pay-remaining')
    payRemaining(@Param('id', ParseIntPipe) id: number, @Req() req){
        return this.orderService.payRemaining(id, req.user.user_id);
    }
}
