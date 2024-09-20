import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionModule } from './auction/auction.module';


@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuctionModule,
  ],
})
export class AppModule {}
