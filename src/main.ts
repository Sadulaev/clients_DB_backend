import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Swagger документация
  const config = new DocumentBuilder()
    .setTitle('Clients DB API')
    .setDescription('API для управления клиентами, продавцами и рассрочками')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Авторизация и регистрация')
    .addTag('client', 'Управление клиентами')
    .addTag('contract', 'Управление рассрочками')
    .addTag('seller', 'Управление продавцами')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Глобальные фильтры (порядок важен: AllExceptions -> HttpException)
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new HttpExceptionFilter(),
  );
  
  // Глобальный интерсептор для единого формата ответов
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  // Валидация с детальными сообщениями об ошибках
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  const port = configService.get<number>('port') || 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
