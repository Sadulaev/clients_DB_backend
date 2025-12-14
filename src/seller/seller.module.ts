import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { SellerSchema, SellerSchemaFactory } from './schemas/seller.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SellerSchema.name, schema: SellerSchemaFactory }
    ])
  ],
  providers: [SellerService],
  controllers: [SellerController],
  exports: [SellerService],
})
export class SellerModule { }
