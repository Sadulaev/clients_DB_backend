import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        const apiResponse: ApiResponse = {
            success: false,
            message: this.extractMessage(exceptionResponse),
            timestamp: new Date().toISOString(),
        };

        // Обработка ошибок валидации
        if (status === HttpStatus.BAD_REQUEST && this.isValidationError(exceptionResponse)) {
            apiResponse.message = 'Ошибка валидации';
            apiResponse.validation = this.formatValidationErrors(exceptionResponse);
        }

        response.status(status).json(apiResponse);
    }

    private extractMessage(exceptionResponse: any): string {
        if (typeof exceptionResponse === 'string') {
            return exceptionResponse;
        }
        if (exceptionResponse.message && typeof exceptionResponse.message === 'string') {
            return exceptionResponse.message;
        }
        if (exceptionResponse.error) {
            return exceptionResponse.error;
        }
        return 'Произошла ошибка';
    }

    private isValidationError(exceptionResponse: any): boolean {
        return (
            typeof exceptionResponse === 'object' &&
            exceptionResponse.message &&
            Array.isArray(exceptionResponse.message)
        );
    }

    private formatValidationErrors(exceptionResponse: any): Record<string, string> {
        const messages: string[] = exceptionResponse.message;
        const validation: Record<string, string> = {};

        for (const message of messages) {
            // Парсим сообщения вида "fullName must be a string" или "email must be an email"
            const fieldMatch = message.match(/^(\w+)\s/);
            if (fieldMatch) {
                const field = fieldMatch[1];
                validation[field] = this.translateValidationMessage(message, field);
            } else {
                // Если не можем распарсить, добавляем как есть
                validation['_error'] = message;
            }
        }

        return validation;
    }

    private translateValidationMessage(message: string, field: string): string {
        // Переводим стандартные сообщения class-validator
        const translations: Record<string, string> = {
            'must be a string': 'Должно быть строкой',
            'must be an email': 'Неверный формат email',
            'should not be empty': 'Поле обязательно для заполнения',
            'must be a number': 'Должно быть числом',
            'must be a boolean': 'Должно быть булевым значением',
            'must be a Date instance': 'Неверный формат даты',
            'must be a valid ISO 8601 date string': 'Неверный формат даты',
            'must be a mongodb id': 'Неверный формат ID',
            'must be shorter than or equal to': 'Превышена максимальная длина',
            'must be longer than or equal to': 'Не достигнута минимальная длина',
            'must be an array': 'Должно быть массивом',
        };

        for (const [pattern, translation] of Object.entries(translations)) {
            if (message.toLowerCase().includes(pattern.toLowerCase())) {
                return translation;
            }
        }

        // Если перевод не найден, убираем название поля и возвращаем остаток
        return message.replace(new RegExp(`^${field}\\s+`, 'i'), '');
    }
}
