import { SetMetadata } from '@nestjs/common';
import { SubscriptionType } from '../../common/enums/subscription.enum';

export const SUBSCRIPTION_KEY = 'requiredSubscription';

/**
 * Декоратор для указания минимально требуемой подписки для эндпоинта
 * 
 * @example
 * @RequiredSubscription(SubscriptionType.PRO)
 * @Get('/pro-feature')
 * getProFeature() { ... }
 */
export const RequiredSubscription = (subscription: SubscriptionType) => 
    SetMetadata(SUBSCRIPTION_KEY, subscription);

