import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsMongoId, IsNumber, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class BillingHistoryItemDto {
    @ApiPropertyOptional({ example: 1, description: 'Номер месяца' })
    @IsNumber()
    month: number;

    @ApiPropertyOptional({ example: 'paid', description: 'Статус оплаты' })
    @IsString()
    status: string;
}

export class UpdateContractDto {
    @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011', description: 'ID клиента' })
    @IsMongoId()
    @IsOptional()
    clientId?: string;

    @ApiPropertyOptional({ example: 'Рассрочка на iPhone 15', description: 'Название рассрочки' })
    @IsString()
    @MaxLength(200)
    @IsOptional()
    title?: string;

    @ApiPropertyOptional({ example: '2024-01-01', description: 'Дата начала (ISO 8601)' })
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @ApiPropertyOptional({ example: '2024-12-31', description: 'Дата окончания (ISO 8601)' })
    @IsDateString()
    @IsOptional()
    endDate?: string;

    @ApiPropertyOptional({ 
        type: [BillingHistoryItemDto], 
        description: 'История оплат' 
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BillingHistoryItemDto)
    @IsOptional()
    billingHistory?: BillingHistoryItemDto[];
}
