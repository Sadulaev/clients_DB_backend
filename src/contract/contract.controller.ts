import { Body, Controller, Delete, Get, Param, Patch, Post, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContractService } from './contract.service';
import { ClientService } from '../client/client.service';
import { AddContractDto } from './dto/add-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';

@ApiTags('contract')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contract')
export class ContractController {
    constructor(
        private readonly contractService: ContractService,
        private readonly clientService: ClientService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Получить все свои рассрочки' })
    @ApiResponse({ status: 200, description: 'Список рассрочек' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    async findAll(@CurrentUser() user: CurrentUserData) {
        return this.contractService.findBySellerId(user.sellerId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить рассрочку по ID' })
    @ApiParam({ name: 'id', description: 'ID рассрочки' })
    @ApiResponse({ status: 200, description: 'Данные рассрочки' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 403, description: 'Нет доступа к этой рассрочке' })
    @ApiResponse({ status: 404, description: 'Рассрочка не найдена' })
    async findById(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
        return this.contractService.findByIdForSeller(id, user.sellerId);
    }

    @Get('client/:clientId')
    @ApiOperation({ summary: 'Получить рассрочки клиента' })
    @ApiParam({ name: 'clientId', description: 'ID клиента' })
    @ApiResponse({ status: 200, description: 'Список рассрочек клиента' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    async findByClientId(@Param('clientId') clientId: string, @CurrentUser() user: CurrentUserData) {
        // Проверяем доступ к клиенту
        await this.clientService.findByIdForSeller(clientId, user.sellerId);
        return this.contractService.findByClientIdForSeller(clientId, user.sellerId);
    }

    @Post()
    @ApiOperation({ summary: 'Создать новую рассрочку' })
    @ApiResponse({ status: 201, description: 'Рассрочка успешно создана' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 403, description: 'Нет доступа к клиенту' })
    @ApiResponse({ status: 404, description: 'Клиент не найден' })
    async create(@Body() addContractDto: AddContractDto, @CurrentUser() user: CurrentUserData) {
        // Первый шаг, проверяем существует ли клиент и есть ли к нему доступ
        await this.clientService.findByIdForSeller(addContractDto.clientId, user.sellerId);

        // Второй шаг, создаем рассрочку с текущим продавцом
        return this.contractService.create(addContractDto, user.sellerId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Обновить рассрочку (только свою)' })
    @ApiParam({ name: 'id', description: 'ID рассрочки' })
    @ApiResponse({ status: 200, description: 'Рассрочка успешно обновлена' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 403, description: 'Можно редактировать только свои рассрочки' })
    @ApiResponse({ status: 404, description: 'Рассрочка не найдена' })
    async update(
        @Param('id') id: string, 
        @Body() updateContractDto: UpdateContractDto,
        @CurrentUser() user: CurrentUserData
    ) {
        // Если меняется клиент - проверяем доступ к нему
        if (updateContractDto.clientId) {
            await this.clientService.findByIdForSeller(updateContractDto.clientId, user.sellerId);
        }

        return this.contractService.update(id, updateContractDto, user.sellerId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Удалить рассрочку (только свою)' })
    @ApiParam({ name: 'id', description: 'ID рассрочки' })
    @ApiResponse({ status: 200, description: 'Рассрочка успешно удалена' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 403, description: 'Можно удалять только свои рассрочки' })
    @ApiResponse({ status: 404, description: 'Рассрочка не найдена' })
    async delete(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
        return this.contractService.delete(id, user.sellerId);
    }
}
