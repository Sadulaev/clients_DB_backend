import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SubscriptionType } from '../../common/enums/subscription.enum';

export interface CurrentUserData {
    sellerId: string;
    phone: string;
    subscription: SubscriptionType;
}

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): CurrentUserData => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

