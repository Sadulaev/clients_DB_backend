import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SellerSchema } from './schemas/seller.schema';
import { Model } from 'mongoose';

@Injectable()
export class SellerService {
    constructor(
        @InjectModel(SellerSchema.name)
        private readonly sellerModel: Model<SellerSchema>
    ) { }

    async findSellerByEmail(email: string) {
        return this.sellerModel.findOne({ email }).exec();
    }

    async findSellerByCompanyName(companyName: string) {
        return this.sellerModel.findOne({ companyName }).exec();
    }

}
