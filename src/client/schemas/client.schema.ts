import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type ClientDocument = HydratedDocument<ClientSchema>;

@Schema()
export class ClientSchema {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  fullName: string;

  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  birthDate: Date;

  @Prop({ required: true, unique: true })
  passportNumber: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true })
  sellerId: mongoose.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }] })
  contracts: mongoose.Types.ObjectId[];

  @Prop({ default: false })
  isPublic: boolean;
}

export const ClientSchemaFactory = SchemaFactory.createForClass(ClientSchema);
