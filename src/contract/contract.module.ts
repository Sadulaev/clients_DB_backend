import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { ContractSchema, ContractSchemaFactory } from './schemas/contract.schema';
import { ClientModule } from '../client/client.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContractSchema.name, schema: ContractSchemaFactory }
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    ClientModule,
  ],
  providers: [ContractService, JwtAuthGuard],
  controllers: [ContractController],
  exports: [ContractService],
})
export class ContractModule { }
