import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { AuctionSchema } from './schemas/auction.schema';
import { BidSchema } from './schemas/bid.schema';
import * as redisStore from 'cache-manager-redis-store'; 
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';


@Module({
  imports: [
    ConfigModule.forRoot(), 
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 600,  
    }),
    MongooseModule.forFeature([
      { name: 'Auction', schema: AuctionSchema },
      { name: 'Bid', schema: BidSchema },
    ]),
  ],
  controllers: [AuctionController],
  providers: [AuctionService],
})
export class AuctionModule {}
