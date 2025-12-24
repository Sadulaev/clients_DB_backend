import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        
        const apiResponse: ApiResponse = {
            success: false,
            message: 'Внутренняя ошибка сервера',
            timestamp: new Date().toISOString(),
        };

        // В режиме разработки показываем детали ошибки
        if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
            apiResponse.message = exception.message;
        }

        console.error('Unhandled exception:', exception);

        response.status(status).json(apiResponse);
    }
}




