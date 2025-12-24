import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SellerModule } from '../seller/seller.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SubscriptionGuard } from './guards/subscription.guard';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('jwt.secret'),
                signOptions: { expiresIn: '60m' },
            }),
            inject: [ConfigService],
        }),
        forwardRef(() => SellerModule), // forwardRef для избежания циклической зависимости
    ],
    providers: [AuthService, JwtAuthGuard, SubscriptionGuard],
    controllers: [AuthController],
    exports: [JwtModule, JwtAuthGuard, SubscriptionGuard],
})
export class AuthModule { }
