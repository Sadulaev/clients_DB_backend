/**
 * Типы подписок для продавцов
 */
export enum SubscriptionType {
    STANDARD = 'standard',
    PRO = 'pro',
}

/**
 * Иерархия подписок (чем выше индекс, тем больше прав)
 */
export const SUBSCRIPTION_HIERARCHY: SubscriptionType[] = [
    SubscriptionType.STANDARD,
    SubscriptionType.PRO,
];

/**
 * Проверяет, имеет ли текущая подписка доступ к требуемому уровню
 */
export function hasSubscriptionAccess(
    currentSubscription: SubscriptionType,
    requiredSubscription: SubscriptionType,
): boolean {
    const currentIndex = SUBSCRIPTION_HIERARCHY.indexOf(currentSubscription);
    const requiredIndex = SUBSCRIPTION_HIERARCHY.indexOf(requiredSubscription);
    
    return currentIndex >= requiredIndex;
}

