import { IsNotEmpty, IsString } from "class-validator";

export class SignInSellerDto {
    @IsString()
    email: string;

    @IsString()
    companyName: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}