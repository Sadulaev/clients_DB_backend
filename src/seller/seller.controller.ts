import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SellerService } from './seller.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionGuard } from '../auth/guards/subscription.guard';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';

@ApiTags('seller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, SubscriptionGuard)
@Controller('seller')
export class SellerController {
    constructor(
        private readonly sellerService: SellerService
    ) { }

    @Get('profile')
    @ApiOperation({ summary: 'Получить профиль текущего продавца' })
    @ApiResponse({ status: 200, description: 'Данные профиля продавца' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 404, description: 'Продавец не найден' })
    async getProfile(@CurrentUser() user: CurrentUserData) {
        const seller = await this.sellerService.findSellerById(user.sellerId);
        
        if (!seller) {
            throw new NotFoundException('Продавец не найден');
        }

        // Возвращаем профиль без passwordHash
        return {
            id: seller._id,
            phone: seller.phone,
            email: seller.email,
            fullName: seller.fullName,
            subscription: seller.subscription,
            clientsCount: seller.clients?.length || 0,
            contractsCount: seller.contracts?.length || 0,
        };
    }
}
