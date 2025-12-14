import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { ClientSchema, ClientSchemaFactory } from './schemas/client.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClientSchema.name, schema: ClientSchemaFactory }
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ClientService, JwtAuthGuard],
  controllers: [ClientController],
  exports: [ClientService],
})
export class ClientModule {}
