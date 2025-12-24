import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SUBSCRIPTION_KEY } from '../decorators/subscription.decorator';
import { SubscriptionType, hasSubscriptionAccess } from '../../common/enums/subscription.enum';

@Injectable()
export class SubscriptionGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // Получаем требуемую подписку из метаданных
        const requiredSubscription = this.reflector.getAllAndOverride<SubscriptionType>(
            SUBSCRIPTION_KEY,
            [context.getHandler(), context.getClass()]
        );

        // Если подписка не указана, разрешаем доступ (доступно всем авторизованным)
        if (!requiredSubscription) {
            return true;
        }

        // Получаем данные пользователя из request (установлены JwtAuthGuard)
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.subscription) {
            throw new ForbiddenException('Не удалось определить уровень подписки');
        }

        // Проверяем, имеет ли пользователь доступ
        const hasAccess = hasSubscriptionAccess(user.subscription, requiredSubscription);

        if (!hasAccess) {
            throw new ForbiddenException(
                `Для доступа к этой функции требуется подписка "${requiredSubscription}" или выше. ` +
                `Ваша текущая подписка: "${user.subscription}"`
            );
        }

        return true;
    }
}

