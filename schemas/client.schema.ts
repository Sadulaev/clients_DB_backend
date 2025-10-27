import { Prop, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Contract } from './contract.schema';
import { Seller } from './seller.schema';

@Schema()
export class Client {
  @Prop({ required: true })
  fullName: string;

  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  birthDate: Date;

  @Prop({ required: true, unique: true })
  passportNumber: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }] })
  contracts: Contract[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }] })
  sellers: Seller[];

  @Prop({ default: false })
  visibilityFlag: boolean;
}
