import { IsEmail, IsNotEmpty } from "class-validator"


export class AdminDto{
    @IsEmail()
    email!: string

    @IsNotEmpty()
    password!: string

    @IsNotEmpty()
    name!: string;
}