import { IsString, IsOptional, IsEmail, MinLength, IsDateString, Matches } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(8)
    @Matches(/^\S+$/)
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string


    @IsOptional()
    @IsString()
    fullName?: string

    @IsOptional()
    @IsDateString()
    birthDate?: string
}