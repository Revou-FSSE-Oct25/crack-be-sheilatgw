import { IsString, IsOptional, IsBoolean, Matches } from "class-validator";

export class CreateAddressDto{
    @IsString()
    recipientName!: string

    @IsString()
    @Matches(/^08[0-9]{8,11}$/, {message: 'mobile number must start with 08 and be valid',})
    phoneNumber!: string

    @IsString()
    fullAddress!: string;

    @IsString()
    province!: string;

    @IsString()
    cityRegency!: string;

    @IsString()
    postalCode!: string;

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}