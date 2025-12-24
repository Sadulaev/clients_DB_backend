import { Body, ConflictException, Controller, NotFoundException, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SellerService } from '../seller/seller.service';
import { SignInSellerDto } from './dto/sign-in.dto';
import { SignUpSellerDto } from './dto/sign-up-dto';
import { AuthService } from './auth.service';
import { SubscriptionType } from '../common/enums/subscription.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly sellerService: SellerService,
        private readonly authService: AuthService,
    ) { }

    @Post('/sign-in')
    @ApiOperation({ summary: 'Авторизация продавца' })
    @ApiResponse({ status: 200, description: 'Успешная авторизация, возвращает JWT токен' })
    @ApiResponse({ status: 404, description: 'Неверные данные авторизации' })
    async signIn(@Body() signInDto: SignInSellerDto) {
        // Первый шаг, ищем продавца по номеру телефона
        const seller = await this.sellerService.findSellerByPhone(signInDto.phone);
        if (!seller) {
            throw new NotFoundException('Неверные данные авторизации');
        }

        // Второй шаг, сверяем пароли
        const isMatch = await this.authService.comparePassword(signInDto.password, seller.passwordHash);

        if (!isMatch) {
            throw new NotFoundException('Неверные данные авторизации');
        }

        // Третий шаг, создаем и возвращаем токен (включая подписку)
        const jwtToken = await this.authService.generateJwtToken(
            seller.phone, 
            seller._id.toString(),
            seller.subscription
        );

        return { accessToken: jwtToken };
    }

    @Post('/sign-up')
    @ApiOperation({ summary: 'Регистрация нового продавца' })
    @ApiResponse({ status: 201, description: 'Успешная регистрация, возвращает JWT токен' })
    @ApiResponse({ status: 409, description: 'Продавец с таким телефоном уже существует' })
    async signUp(@Body() signUpDto: SignUpSellerDto) {
        // Первый шаг, проверяем существует ли продавец с таким номером телефона
        const existingByPhone = await this.sellerService.findSellerByPhone(signUpDto.phone);
        if (existingByPhone) {
            throw new ConflictException('Продавец с таким номером телефона уже существует');
        }

        // Второй шаг, если указан email, проверяем его уникальность
        if (signUpDto.email) {
            const existingByEmail = await this.sellerService.findSellerByEmail(signUpDto.email);
            if (existingByEmail) {
                throw new ConflictException('Продавец с такой почтой уже существует');
            }
        }

        // Третий шаг, хешируем пароль
        const passwordHash = await this.authService.hashPassword(signUpDto.password);

        // Четвертый шаг, создаем нового продавца
        const newSeller = await this.sellerService.createSeller(
            signUpDto.fullName,
            signUpDto.phone,
            passwordHash,
            signUpDto.email,
        );

        // Пятый шаг, генерируем и возвращаем токен (с дефолтной подпиской standard)
        const jwtToken = await this.authService.generateJwtToken(
            newSeller.phone, 
            newSeller._id.toString(),
            SubscriptionType.STANDARD
        );

        return { accessToken: jwtToken };
    }

    @Post('/sign-out')
    @ApiOperation({ summary: 'Выход из системы' })
    @ApiResponse({ status: 200, description: 'Успешный выход' })
    signOut() {
        return { message: 'Выход выполнен' };
    }
}
