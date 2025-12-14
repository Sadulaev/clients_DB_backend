import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SellerSchema, SellerDocument } from './schemas/seller.schema';
import { Model } from 'mongoose';

@Injectable()
export class SellerService {
    constructor(
        @InjectModel(SellerSchema.name)
        private readonly sellerModel: Model<SellerDocument>
    ) { }

    async findSellerById(id: string) {
        return this.sellerModel.findById(id).exec();
    }

    async findSellerByEmail(email: string) {
        return this.sellerModel.findOne({ email }).exec();
    }

    async findSellerByCompanyName(companyName: string) {
        return this.sellerModel.findOne({ companyName }).exec();
    }

    async createSeller(fullName: string, email: string, companyName: string, passwordHash: string) {
        const newSeller = new this.sellerModel({
            fullName,
            email,
            companyName,
            passwordHash,
        });
        return newSeller.save();
    }

}
