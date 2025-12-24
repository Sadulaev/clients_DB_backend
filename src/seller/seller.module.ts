import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { SellerSchema, SellerSchemaFactory } from './schemas/seller.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SellerSchema.name, schema: SellerSchemaFactory }
    ]),
    forwardRef(() => AuthModule), // forwardRef для избежания циклической зависимости
  ],
  providers: [SellerService],
  controllers: [SellerController],
  exports: [SellerService],
})
export class SellerModule { }
