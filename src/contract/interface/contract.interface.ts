import { Document } from "mongoose";
import IClient from "../../client/interface/client.interface";
import ISeller from "../../seller/interface/seller.interface";

export default interface IContract extends Document {
      client: IClient;
    
      seller: ISeller;
    
      title: string;
    
      startDate: Date;
    
      endDate: Date;
    
      billingHistory: { month: number; status: string }[];
}