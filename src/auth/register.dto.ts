import { IsString, MinLength, Matches, IsEmail, IsDateString, IsNotEmpty } from "class-validator";

export class RegisterDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    @Matches(/^\S+$/)
    username!: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/\S/)
    fullName!: string;

    @IsString()
    @MinLength(10)
    @Matches(/^\S+$/)
    password!: string

    @IsDateString()
    birthDate!: string
}