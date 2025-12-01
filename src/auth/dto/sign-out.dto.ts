import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class SignOutSellerDto {
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    fullName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;


    @IsString()
    @MaxLength(24)
    @IsNotEmpty()
    companyName: string;

    @IsString()
    @MaxLength(18)
    @IsNotEmpty()
    password: string;
}