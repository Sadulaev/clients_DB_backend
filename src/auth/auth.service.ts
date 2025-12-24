import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IJwtPayload } from './interface/jwt.interface';
import { SubscriptionType } from '../common/enums/subscription.enum';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService
    ) { }

    private readonly saltRounds = 10;

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    async comparePassword(plaintextPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plaintextPassword, hashedPassword);
    }

    async generateJwtToken(
        phone: string, 
        sellerId: string, 
        subscription: SubscriptionType
    ): Promise<string> {
        const payload: IJwtPayload = { phone, sellerId, subscription };

        return this.jwtService.sign(payload);
    }
}