import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Bid } from './bid.schema';

@Schema({ timestamps: true }) 
export class Auction extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: true })
  minimumBid: number;

  @Prop({ required: true })
  minimumAskingPrice: number;

  @Prop({ type: [{ type: Object, ref: 'Bid' }] })
  bids: Bid[];

  @Prop()  
  createdAt?: Date;

  @Prop() 
  updatedAt?: Date;

}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
