import { Prop, raw, Schema } from '@nestjs/mongoose';
import { Client } from './client.schema';
import mongoose from 'mongoose';
import { Seller } from './seller.schema';

@Schema()
export class Contract {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true })
  client: Client;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true })
  seller: Seller;

  @Prop({ required: true })
  title: string;

  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  startDate: Date;

  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  endDate: Date;

  @Prop(raw([{ month: { type: Number }, status: { type: String } }]))
  billingHistory: { month: number; status: string }[];
}
