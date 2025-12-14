import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SignUpSellerDto {
    @ApiProperty({ example: 'Иван Иванов', description: 'ФИО продавца' })
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ example: 'ivan@example.com', description: 'Email продавца' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'ООО Рога и Копыта', description: 'Название компании' })
    @IsString()
    @MaxLength(24)
    @IsNotEmpty()
    companyName: string;

    @ApiProperty({ example: 'securePassword123', description: 'Пароль' })
    @IsString()
    @MaxLength(18)
    @IsNotEmpty()
    password: string;
}
