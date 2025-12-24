import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SignInSellerDto {
    @ApiProperty({ example: '+79991234567', description: 'Номер телефона продавца (РФ)' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\+7\d{10}$/, { message: 'Номер телефона должен быть в формате +7XXXXXXXXXX' })
    phone: string;

    @ApiProperty({ example: 'securePassword123', description: 'Пароль' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
