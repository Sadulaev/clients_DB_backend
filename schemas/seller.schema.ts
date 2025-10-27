import { Prop, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Client } from './client.schema';
import { Contract } from './contract.schema';

@Schema()
export class Seller {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  companyName: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }] })
  clients: Client[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }] })
  contracts: Contract[];
}
