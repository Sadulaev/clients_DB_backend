import { Document } from "mongoose";
import ISeller from "../../seller/interface/seller.interface";
import IContract from "../../contract/interface/contract.interface";

export default interface IClient extends Document {
      fullName: string;
    
      birthDate: Date;
    
      passportNumber: string;
    
      contracts: IContract[];
    
      sellers: ISeller[];
    
      visibilityFlag: boolean;
}