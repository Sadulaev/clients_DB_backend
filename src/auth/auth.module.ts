import { Module } from '@nestjs/common';
import { SellerService } from '../seller/seller.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '60m' },
            }),
            inject: [ConfigService],
        }),
        SellerService
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [
        JwtModule
    ]
})
export class AuthModule { }