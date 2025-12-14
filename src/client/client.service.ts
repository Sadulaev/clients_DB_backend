import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientSchema, ClientDocument } from './schemas/client.schema';
import { AddClientDto } from './dto/add-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
    constructor(
        @InjectModel(ClientSchema.name)
        private readonly clientModel: Model<ClientDocument>
    ) { }

    // Получить всех клиентов, доступных для продавца (публичные + свои)
    async findAllForSeller(sellerId: string) {
        return this.clientModel.find({
            $or: [
                { isPublic: true },
                { sellerId: sellerId }
            ]
        }).exec();
    }

    // Получить клиента по ID с проверкой доступа
    async findByIdForSeller(id: string, sellerId: string) {
        const client = await this.clientModel.findById(id).exec();
        
        if (!client) {
            throw new NotFoundException('Клиент не найден');
        }

        // Проверяем доступ: публичный или создатель
        if (!client.isPublic && client.sellerId.toString() !== sellerId) {
            throw new ForbiddenException('Нет доступа к этому клиенту');
        }

        return client;
    }

    // Получить клиента по ID (без проверки доступа - для внутреннего использования)
    async findById(id: string) {
        const client = await this.clientModel.findById(id).exec();
        if (!client) {
            throw new NotFoundException('Клиент не найден');
        }
        return client;
    }

    async findByPassportNumber(passportNumber: string) {
        return this.clientModel.findOne({ passportNumber }).exec();
    }

    async create(addClientDto: AddClientDto, sellerId: string) {
        const newClient = new this.clientModel({
            fullName: addClientDto.fullName,
            birthDate: new Date(addClientDto.birthDate),
            passportNumber: addClientDto.passportNumber,
            sellerId: sellerId,
            isPublic: addClientDto.isPublic ?? false,
        });
        return newClient.save();
    }

    async update(id: string, updateClientDto: UpdateClientDto, sellerId: string) {
        // Проверяем, что клиент принадлежит этому продавцу
        const client = await this.clientModel.findById(id).exec();
        
        if (!client) {
            throw new NotFoundException('Клиент не найден');
        }

        if (client.sellerId.toString() !== sellerId) {
            throw new ForbiddenException('Вы можете редактировать только своих клиентов');
        }

        const updateData: any = { ...updateClientDto };
        if (updateClientDto.birthDate) {
            updateData.birthDate = new Date(updateClientDto.birthDate);
        }

        const updatedClient = await this.clientModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();

        return updatedClient;
    }

    async delete(id: string, sellerId: string) {
        // Проверяем, что клиент принадлежит этому продавцу
        const client = await this.clientModel.findById(id).exec();
        
        if (!client) {
            throw new NotFoundException('Клиент не найден');
        }

        if (client.sellerId.toString() !== sellerId) {
            throw new ForbiddenException('Вы можете удалять только своих клиентов');
        }

        return this.clientModel.findByIdAndDelete(id).exec();
    }

    // Получить только своих клиентов
    async findMy(sellerId: string) {
        return this.clientModel.find({ sellerId }).exec();
    }
}
