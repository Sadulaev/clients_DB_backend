import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type SellerDocument = HydratedDocument<SellerSchema>;

@Schema()
export class SellerSchema {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  companyName: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }] })
  clients: mongoose.Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }] })
  contracts: mongoose.Types.ObjectId[];

  @Prop({ required: true })
  passwordHash: string;
}

export const SellerSchemaFactory = SchemaFactory.createForClass(SellerSchema);
