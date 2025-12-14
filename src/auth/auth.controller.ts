import { BadRequestException, Body, ConflictException, Controller, NotFoundException, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SellerService } from '../seller/seller.service';
import { SignInSellerDto } from './dto/sign-in.dto';
import { SignUpSellerDto } from './dto/sign-up-dto';
import { AuthService } from './auth.service';
import { SellerSchema } from '../seller/schemas/seller.schema';

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
    @ApiResponse({ status: 400, description: 'Не указан email или название компании' })
    @ApiResponse({ status: 404, description: 'Неверные данные авторизации' })
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
            const jwtToken = await this.authService.generateJwtToken(sellerByData.companyName, sellerByData._id.toString());

            // 5. Возвращаем токен клиенту
            return { accessToken: jwtToken };
        }
    }

    @Post('/sign-up')
    @ApiOperation({ summary: 'Регистрация нового продавца' })
    @ApiResponse({ status: 201, description: 'Успешная регистрация, возвращает JWT токен' })
    @ApiResponse({ status: 409, description: 'Продавец с такой почтой или компанией уже существует' })
    async signUp(@Body() signUpDto: SignUpSellerDto) {
        // Первый шаг, проверяем существует ли продавец с такой почтой
        const existingByEmail = await this.sellerService.findSellerByEmail(signUpDto.email);
        if (existingByEmail) {
            throw new ConflictException('Продавец с такой почтой уже существует');
        }

        // Второй шаг, проверяем существует ли продавец с таким названием компании
        const existingByCompany = await this.sellerService.findSellerByCompanyName(signUpDto.companyName);
        if (existingByCompany) {
            throw new ConflictException('Продавец с таким названием компании уже существует');
        }

        // Третий шаг, хешируем пароль
        const passwordHash = await this.authService.hashPassword(signUpDto.password);

        // Четвертый шаг, создаем нового продавца
        const newSeller = await this.sellerService.createSeller(
            signUpDto.fullName,
            signUpDto.email,
            signUpDto.companyName,
            passwordHash,
        );

        // Пятый шаг, генерируем и возвращаем токен
        const jwtToken = await this.authService.generateJwtToken(newSeller.companyName, newSeller._id.toString());

        return { accessToken: jwtToken };
    }

    @Post('/sign-out')
    @ApiOperation({ summary: 'Выход из системы' })
    @ApiResponse({ status: 200, description: 'Успешный выход' })
    signOut() {
        return { message: 'Выход выполнен' };
    }
}
