import { IsString, IsOptional, IsInt } from "class-validator";

export class CategoryDto{
    @IsString()
    name!: string

    @IsOptional()
    @IsInt()
    parentId?: number
}