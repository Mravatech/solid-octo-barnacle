import { Bid } from "src/auction/schemas/bid.schema";

export interface Auction {
    startTime: string;
    endTime: string;
    name: string;
    minimumBid: number;
    minimumAskingPrice: number;
    bids: Bid[];
  }
  