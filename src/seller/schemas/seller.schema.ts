import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { SubscriptionType } from '../../common/enums/subscription.enum';

export type SellerDocument = HydratedDocument<SellerSchema>;

@Schema()
export class SellerSchema {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: false })
  email?: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ 
    type: String, 
    enum: SubscriptionType, 
    default: SubscriptionType.STANDARD 
  })
  subscription: SubscriptionType;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }] })
  clients: mongoose.Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }] })
  contracts: mongoose.Types.ObjectId[];

  @Prop({ required: true })
  passwordHash: string;
}

export const SellerSchemaFactory = SchemaFactory.createForClass(SellerSchema);
