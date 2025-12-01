import { Body, Controller, Post } from '@nestjs/common';
import { SellerService } from './seller.service';

@Controller('seller')
export class SellerController {
    constructor(
        private readonly sellerService: SellerService
    ) { }

}
