import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';

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

    async generateJwtToken(companyName: string, sellerId: string): Promise<string> {
        const payload: JwtPayload = { companyName, sellerId };

        return this.jwtService.sign(payload);
    }
}