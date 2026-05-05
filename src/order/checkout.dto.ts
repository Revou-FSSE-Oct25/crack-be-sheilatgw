import { IsInt, IsOptional, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class CheckoutItemDto {
  @Type(() => Number)
  @IsInt()
  cartId!: number;

  @IsOptional()
  @IsNumber()
  dpAmount?: number;
}