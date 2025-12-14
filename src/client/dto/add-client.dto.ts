import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class AddClientDto {
    @ApiProperty({ example: 'Петр Петров', description: 'ФИО клиента' })
    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ example: '1990-05-15', description: 'Дата рождения (ISO 8601)' })
    @IsDateString()
    @IsNotEmpty()
    birthDate: string;

    @ApiProperty({ example: '1234 567890', description: 'Номер паспорта' })
    @IsString()
    @MaxLength(20)
    @IsNotEmpty()
    passportNumber: string;

    @ApiPropertyOptional({ example: false, description: 'Публичный клиент (виден всем продавцам)', default: false })
    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;
}
