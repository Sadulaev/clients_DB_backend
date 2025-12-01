import { BadRequestException, Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { SellerService } from '../seller/seller.service';
import { SignInSellerDto } from './dto/sign-in.dto';
import { SignOutSellerDto } from './dto/sign-out.dto';
import { AuthService } from './auth.service';
import { SellerSchema } from '../seller/schemas/seller.schema';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly sellerService: SellerService,
        private readonly authService: AuthService,
    ) { }

    @Post("/sign-in")
    async signIn(@Body() signInDto: SignInSellerDto) {
        // Первый шаг, если нет почты или компании то стопаем процесс
        if (!signInDto.email && !signInDto.companyName) {
            throw new BadRequestException('Почта или названием компании не может быть пустым');
        }

        // Второй шаг, ищем запись по почте или названию
        let sellerByData: SellerSchema | undefined;
        if (signInDto.email) {
            sellerByData = await this.sellerService.findSellerByEmail(signInDto.email);
        } else if (signInDto.companyName) {
            sellerByData = await this.sellerService.findSellerByCompanyName(signInDto.companyName);
        } else {
            throw new NotFoundException('Неверные данные авторизации');
        }

        // Третий шаг, сверяем пароли
        const isMatch = await this.authService.comparePassword(signInDto.password, sellerByData.passwordHash);

        if (!isMatch) {
            throw new NotFoundException('Неверные данные авторизации');
        } else {
            // Четвертый шаг, создаем и возвращаем токен
            const jwtToken = await this.authService.generateJwtToken(sellerByData.companyName, sellerByData.);

            // 3. Return the token to the client
            return { accessToken: jwtToken };
        }

    }

    @Post("/sign-up")
    signUp(@Body() signOutDto: SignOutSellerDto) {
        return 'signed out'
    }

    @Post("/sign-out")
    signOut() {

    }
}
