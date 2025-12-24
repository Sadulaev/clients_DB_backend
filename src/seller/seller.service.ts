import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SellerSchema, SellerDocument } from './schemas/seller.schema';
import { Model } from 'mongoose';
import { SubscriptionType } from '../common/enums/subscription.enum';

@Injectable()
export class SellerService {
    constructor(
        @InjectModel(SellerSchema.name)
        private readonly sellerModel: Model<SellerDocument>
    ) { }

    async findSellerById(id: string) {
        return this.sellerModel.findById(id).exec();
    }

    async findSellerByPhone(phone: string) {
        return this.sellerModel.findOne({ phone }).exec();
    }

    async findSellerByEmail(email: string) {
        return this.sellerModel.findOne({ email }).exec();
    }

    async createSeller(fullName: string, phone: string, passwordHash: string, email?: string) {
        const newSeller = new this.sellerModel({
            fullName,
            phone,
            email,
            passwordHash,
            subscription: SubscriptionType.STANDARD, // По умолчанию стандартная подписка
        });
        return newSeller.save();
    }

    async updateSubscription(sellerId: string, subscription: SubscriptionType) {
        return this.sellerModel.findByIdAndUpdate(
            sellerId,
            { subscription },
            { new: true }
        ).exec();
    }

}
