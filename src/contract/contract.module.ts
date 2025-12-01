import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { SellerService } from '../seller/seller.service';

@Module({
  providers: [SellerService, ContractService],
  controllers: [ContractController]
})
export class ContractModule {}
