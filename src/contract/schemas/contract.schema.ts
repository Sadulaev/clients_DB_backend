import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type ContractDocument = HydratedDocument<ContractSchema>;

@Schema()
export class ContractSchema {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true })
  client: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true })
  seller: mongoose.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  startDate: Date;

  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  endDate: Date;

  @Prop(raw([{ month: { type: Number }, status: { type: String } }]))
  billingHistory: { month: number; status: string }[];
}

export const ContractSchemaFactory = SchemaFactory.createForClass(ContractSchema);
