import { Body, Controller, Delete, Get, Param, Patch, Post, ConflictException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { AddClientDto } from './dto/add-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionGuard } from '../auth/guards/subscription.guard';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { RequiredSubscription } from '../auth/decorators/subscription.decorator';
import { SubscriptionType } from '../common/enums/subscription.enum';

@ApiTags('client')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, SubscriptionGuard)
@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    @Get()
    @ApiOperation({ summary: 'Получить всех доступных клиентов (публичные + свои)' })
    @ApiResponse({ status: 200, description: 'Список клиентов' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    async findAll(@CurrentUser() user: CurrentUserData) {
        return this.clientService.findAllForSeller(user.sellerId);
    }

    @Get('my')
    @ApiOperation({ summary: 'Получить только своих клиентов' })
    @ApiResponse({ status: 200, description: 'Список своих клиентов' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    async findMy(@CurrentUser() user: CurrentUserData) {
        return this.clientService.findMy(user.sellerId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить клиента по ID' })
    @ApiParam({ name: 'id', description: 'ID клиента' })
    @ApiResponse({ status: 200, description: 'Данные клиента' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 403, description: 'Нет доступа к этому клиенту' })
    @ApiResponse({ status: 404, description: 'Клиент не найден' })
    async findById(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
        return this.clientService.findByIdForSeller(id, user.sellerId);
    }

    @Post()
    @ApiOperation({ summary: 'Создать нового клиента' })
    @ApiResponse({ status: 201, description: 'Клиент успешно создан' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 409, description: 'Клиент с таким паспортом уже существует' })
    async create(@Body() addClientDto: AddClientDto, @CurrentUser() user: CurrentUserData) {
        // Первый шаг, проверяем существует ли клиент с таким паспортом
        const existingClient = await this.clientService.findByPassportNumber(addClientDto.passportNumber);
        if (existingClient) {
            throw new ConflictException('Клиент с таким номером паспорта уже существует');
        }

        // Второй шаг, создаем нового клиента с привязкой к продавцу
        return this.clientService.create(addClientDto, user.sellerId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Обновить данные клиента (только своего)' })
    @ApiParam({ name: 'id', description: 'ID клиента' })
    @ApiResponse({ status: 200, description: 'Клиент успешно обновлен' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 403, description: 'Можно редактировать только своих клиентов' })
    @ApiResponse({ status: 404, description: 'Клиент не найден' })
    @ApiResponse({ status: 409, description: 'Клиент с таким паспортом уже существует' })
    async update(
        @Param('id') id: string, 
        @Body() updateClientDto: UpdateClientDto,
        @CurrentUser() user: CurrentUserData
    ) {
        // Первый шаг, если меняется паспорт - проверяем уникальность
        if (updateClientDto.passportNumber) {
            const existingClient = await this.clientService.findByPassportNumber(updateClientDto.passportNumber);
            if (existingClient && existingClient._id.toString() !== id) {
                throw new ConflictException('Клиент с таким номером паспорта уже существует');
            }
        }

        // Второй шаг, обновляем клиента (с проверкой владельца внутри сервиса)
        return this.clientService.update(id, updateClientDto, user.sellerId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Удалить клиента (только своего)' })
    @ApiParam({ name: 'id', description: 'ID клиента' })
    @ApiResponse({ status: 200, description: 'Клиент успешно удален' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 403, description: 'Можно удалять только своих клиентов' })
    @ApiResponse({ status: 404, description: 'Клиент не найден' })
    async delete(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
        return this.clientService.delete(id, user.sellerId);
    }
}
