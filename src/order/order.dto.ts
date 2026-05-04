import { IsInt, IsEnum, IsString, IsNotEmpty} from "class-validator";
import { ShippingMethod, PaymentMethod } from "src/generated/prisma/enums";
import { Type } from "class-transformer";

export class OrderDto{
    @Type(() => Number)
    @IsInt()
    addressId!: number

    @IsEnum(ShippingMethod)
    shippingMethod!: ShippingMethod

    @IsString()
    @IsNotEmpty()
    courier!: string

    @IsString()
    @IsNotEmpty()
    shippingService!: string

    @IsEnum(PaymentMethod)
    @IsNotEmpty()
    paymentMethod!: PaymentMethod
}