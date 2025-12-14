import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateClientDto {
    @ApiPropertyOptional({ example: 'Петр Петров', description: 'ФИО клиента' })
    @IsString()
    @MaxLength(100)
    @IsOptional()
    fullName?: string;

    @ApiPropertyOptional({ example: '1990-05-15', description: 'Дата рождения (ISO 8601)' })
    @IsDateString()
    @IsOptional()
    birthDate?: string;

    @ApiPropertyOptional({ example: '1234 567890', description: 'Номер паспорта' })
    @IsString()
    @MaxLength(20)
    @IsOptional()
    passportNumber?: string;

    @ApiPropertyOptional({ example: true, description: 'Публичный клиент (виден всем продавцам)' })
    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;
}
