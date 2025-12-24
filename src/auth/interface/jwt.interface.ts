import { SubscriptionType } from '../../common/enums/subscription.enum';

export interface IJwtPayload {
    phone: string;
    sellerId: string;
    subscription: SubscriptionType;
}