import { Prop, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import ISeller from '../../seller/interface/seller.interface';
import IContract from '../../contract/interface/contract.interface';

@Schema()
export class ClientSchema {
  @Prop({ required: true })
  fullName: string;

  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  birthDate: Date;

  @Prop({ required: true, unique: true })
  passportNumber: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }] })
  contracts: IContract[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }] })
  sellers: ISeller[];

  @Prop({ default: false })
  visibilityFlag: boolean;
}
