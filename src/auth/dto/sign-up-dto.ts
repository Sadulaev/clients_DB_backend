import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class SignUpSellerDto {
    @ApiProperty({ example: 'Иван Иванов', description: 'ФИО продавца' })
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ example: '+79991234567', description: 'Номер телефона продавца (РФ)' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\+7\d{10}$/, { message: 'Номер телефона должен быть в формате +7XXXXXXXXXX' })
    phone: string;

    @ApiPropertyOptional({ example: 'ivan@example.com', description: 'Email продавца (опционально)' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: 'securePassword123', description: 'Пароль' })
    @IsString()
    @MaxLength(18)
    @IsNotEmpty()
    password: string;
}
