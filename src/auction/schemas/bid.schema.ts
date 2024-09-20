import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Auction } from './auction.schema';

@Schema({ timestamps: true })  
export class Bid extends Document {
  @Prop({ required: true })
  bidAmount: number;

  @Prop({ required: true })
  userId: number;

  @Prop({ type: Object, ref: 'Auction', required: true })
  auction: Auction;

  @Prop()  
  createdAt?: Date;

  @Prop() 
  updatedAt?: Date;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
