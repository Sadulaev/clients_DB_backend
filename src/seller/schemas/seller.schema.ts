import { Prop, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import IClient from '../../client/interface/client.interface';
import IContract from '../../contract/interface/contract.interface';

@Schema()
export class SellerSchema {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  companyName: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }] })
  clients: IClient[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }] })
  contracts: IContract[];

  @Prop({ required: true })
  passwordHash: string;
}
