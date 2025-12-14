import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignInSellerDto {
    @ApiPropertyOptional({ example: 'ivan@example.com', description: 'Email продавца (или companyName)' })
    @IsString()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({ example: 'ООО Рога и Копыта', description: 'Название компании (или email)' })
    @IsString()
    @IsOptional()
    companyName?: string;

    @ApiProperty({ example: 'securePassword123', description: 'Пароль' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
