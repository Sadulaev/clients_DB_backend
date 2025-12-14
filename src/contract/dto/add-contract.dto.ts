import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class BillingHistoryItemDto {
    @ApiProperty({ example: 1, description: 'Номер месяца' })
    @IsNumber()
    @IsNotEmpty()
    month: number;

    @ApiProperty({ example: 'paid', description: 'Статус оплаты (paid, pending, overdue)' })
    @IsString()
    @IsNotEmpty()
    status: string;
}

export class AddContractDto {
    @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'ID клиента' })
    @IsMongoId()
    @IsNotEmpty()
    clientId: string;

    @ApiProperty({ example: 'Рассрочка на iPhone 15', description: 'Название рассрочки' })
    @IsString()
    @MaxLength(200)
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: '2024-01-01', description: 'Дата начала (ISO 8601)' })
    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @ApiProperty({ example: '2024-12-31', description: 'Дата окончания (ISO 8601)' })
    @IsDateString()
    @IsNotEmpty()
    endDate: string;

    @ApiPropertyOptional({ 
        type: [BillingHistoryItemDto], 
        description: 'История оплат',
        example: [{ month: 1, status: 'paid' }, { month: 2, status: 'pending' }]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BillingHistoryItemDto)
    @IsOptional()
    billingHistory?: BillingHistoryItemDto[];
}
