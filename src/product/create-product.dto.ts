import { IsBoolean, IsDateString, IsDecimal, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { OrderType, POStatus } from "src/generated/prisma/enums";

export class CreateProductDto{
    @IsString()
    name!: string

    @IsNumber()
    price!: number

    @IsString()
    description!: string

    @IsNumber()
    stock!: number

    @IsEnum(OrderType)
    orderType!: OrderType

    @IsOptional()
    @IsEnum(POStatus)
    preStatus?: POStatus

    @IsOptional()
    @IsDateString()
    poDeadline?: string

    @IsBoolean()
    isSoldOut!: boolean

    @IsString()
    imageUrl!: string

    @IsNumber()
    categoryId!: number

    @IsNumber()
    characterId!: number

    @IsNumber()
    seriesId!: number;

    @IsNumber()
    manufacturerId!: number
}