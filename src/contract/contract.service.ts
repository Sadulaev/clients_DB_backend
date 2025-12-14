import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContractSchema, ContractDocument } from './schemas/contract.schema';
import { AddContractDto } from './dto/add-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractService {
    constructor(
        @InjectModel(ContractSchema.name)
        private readonly contractModel: Model<ContractDocument>
    ) { }

    async findBySellerId(sellerId: string) {
        return this.contractModel
            .find({ seller: sellerId })
            .populate('client')
            .exec();
    }

    async findByIdForSeller(id: string, sellerId: string) {
        const contract = await this.contractModel
            .findById(id)
            .populate('client')
            .exec();

        if (!contract) {
            throw new NotFoundException('Рассрочка не найдена');
        }

        if (contract.seller.toString() !== sellerId) {
            throw new ForbiddenException('Нет доступа к этой рассрочке');
        }

        return contract;
    }

    async findById(id: string) {
        const contract = await this.contractModel
            .findById(id)
            .populate('client')
            .exec();

        if (!contract) {
            throw new NotFoundException('Рассрочка не найдена');
        }
        return contract;
    }

    async findByClientIdForSeller(clientId: string, sellerId: string) {
        return this.contractModel
            .find({ client: clientId, seller: sellerId })
            .exec();
    }

    async create(addContractDto: AddContractDto, sellerId: string) {
        const newContract = new this.contractModel({
            client: addContractDto.clientId,
            seller: sellerId,
            title: addContractDto.title,
            startDate: new Date(addContractDto.startDate),
            endDate: new Date(addContractDto.endDate),
            billingHistory: addContractDto.billingHistory || [],
        });
        return newContract.save();
    }

    async update(id: string, updateContractDto: UpdateContractDto, sellerId: string) {
        const contract = await this.contractModel.findById(id).exec();

        if (!contract) {
            throw new NotFoundException('Рассрочка не найдена');
        }

        if (contract.seller.toString() !== sellerId) {
            throw new ForbiddenException('Можно редактировать только свои рассрочки');
        }

        const updateData: any = {};

        if (updateContractDto.clientId) {
            updateData.client = updateContractDto.clientId;
        }
        if (updateContractDto.title) {
            updateData.title = updateContractDto.title;
        }
        if (updateContractDto.startDate) {
            updateData.startDate = new Date(updateContractDto.startDate);
        }
        if (updateContractDto.endDate) {
            updateData.endDate = new Date(updateContractDto.endDate);
        }
        if (updateContractDto.billingHistory) {
            updateData.billingHistory = updateContractDto.billingHistory;
        }

        const updatedContract = await this.contractModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate('client')
            .exec();

        return updatedContract;
    }

    async delete(id: string, sellerId: string) {
        const contract = await this.contractModel.findById(id).exec();

        if (!contract) {
            throw new NotFoundException('Рассрочка не найдена');
        }

        if (contract.seller.toString() !== sellerId) {
            throw new ForbiddenException('Можно удалять только свои рассрочки');
        }

        return this.contractModel.findByIdAndDelete(id).exec();
    }
}
