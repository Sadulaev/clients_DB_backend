import { Document } from "mongoose"
import IClient from "../../client/interface/client.interface";
import IContract from "../../contract/interface/contract.interface";

export default interface ISeller extends Document {
      email: string;

      fullName: string;
    
      companyName: string;
    
      clients: IClient[];
    
      contracts: IContract[];
}