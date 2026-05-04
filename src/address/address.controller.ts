import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards, ParseIntPipe,} from "@nestjs/common";
import { AddressService } from "./address.service";
import { CreateAddressDto } from "./create-address.dto";
import { UpdateAddressDto } from "./update-address.dto";
import { JwtAuthGuard } from "src/auth/jwt.guard";

@UseGuards(JwtAuthGuard)
@Controller("addresses")
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post()
  create(@Body() dto: CreateAddressDto, @Req() req) {
    return this.addressService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Req() req) {
    return this.addressService.findAll(req.user.id);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number, @Req() req) {
    return this.addressService.findOne(id, req.user.id);
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateAddressDto, @Req() req) {
    return this.addressService.update(id, dto, req.user.id);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @Req() req) {
    return this.addressService.remove(id, req.user.id);
  }

  @Patch(":id/default")
  setDefault(@Param("id", ParseIntPipe) id: number, @Req() req) {
    return this.addressService.setDefault(id, req.user.id);
  }
}