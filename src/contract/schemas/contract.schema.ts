import { Prop, raw, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import IClient from '../../client/interface/client.interface';
import ISeller from '../../seller/interface/seller.interface';

@Schema()
export class Contract {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true })
  client: IClient;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true })
  seller: ISeller;

  @Prop({ required: true })
  title: string;

  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  startDate: Date;

  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  endDate: Date;

  @Prop(raw([{ month: { type: Number }, status: { type: String } }]))
  billingHistory: { month: number; status: string }[];
}
