import { IsString, IsOptional, IsEmail, MinLength, IsDateString, Matches } from "class-validator";

export class PasswordDto{
    @IsString()
    currentPassword!: string;

    @IsString()
    @MinLength(10)
    @Matches(/^\S+$/)
    newPassword!: string

    @IsString()
    confirmPassword!: string;
}
    