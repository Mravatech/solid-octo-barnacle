import { Inject,Injectable, BadRequestException, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auction } from './schemas/auction.schema';
import { Bid } from './schemas/bid.schema';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { CreateBidDto } from './dto/create-bid.dto';
import { formattedDate } from '../../utils/date-utils';
import moment from 'moment-timezone';
import { Auction as AuctionDetail } from 'src/types/auction.interface';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';


@Injectable()
export class AuctionService {
  constructor(
    @InjectModel('Auction') private auctionModel: Model<Auction>,
    @InjectModel('Bid') private bidModel: Model<Bid>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  // Creates a new auction
  async createAuction(createAuctionDto: CreateAuctionDto) {
    try {
      const createdAuction = await this.auctionModel.create(createAuctionDto);
      const displayAuction = {
        ...createdAuction.toObject(),
        startTime: formattedDate(createdAuction.startTime),
        endTime: formattedDate(createdAuction.endTime),
      };

      return {
        statusCode: HttpStatus.CREATED,
        data: displayAuction,
        message: 'Auction created successfully',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // Retrieves a specific auction by ID
  async getAuction(auctionId: string) {
    const auction = await this.auctionModel.findById(auctionId).populate('bids').exec();

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    const displayAuction = {
      ...auction.toObject(),
      startTime: formattedDate(auction.startTime),
      endTime: formattedDate(auction.endTime),
    };

    return {
      statusCode: HttpStatus.OK,
      data: displayAuction,
      message: 'Auction retrieved successfully',
    };
  }

  // Places a bid on a specific auction
  async placeBid(auctionId: string, createBidDto: CreateBidDto) {
    const auction = await this.auctionModel.findById(auctionId).exec();

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    const now = new Date(); 
    const auctionStartTimeUTC = new Date(auction.startTime); 
    
    // Ensure auction is within valid time range
    if (now.getTime() < auctionStartTimeUTC.getTime()) {
      throw new BadRequestException('Auction is not open for bidding');
    }

    if (now > auction.endTime) {
      throw new BadRequestException('Auction is closed for bidding');
    }

    // Validate the bid amount
    if (createBidDto.bidAmount < auction.minimumBid) {
      throw new BadRequestException(`Bid amount must be at least ${auction.minimumBid}`);
    }

    const bid = await this.bidModel.create({
      bidAmount: createBidDto.bidAmount,
      userId: createBidDto.userId, // Ideally, this should come from the authenticated user context (e.g., JWT token)
      auction: auction._id,
    });

    auction.bids.push(bid);
    await auction.save();

    return {
      statusCode: HttpStatus.CREATED,
      data: bid,
      message: 'Bid placed successfully',
    };
  }

  // Retrieves all auctions
  async getAllAuctions(): Promise<{ statusCode: number; data: AuctionDetail[]; message: string }> {

    const cacheKey = `auctions`;
    // Check if the result is already cached
    const cachedAuctions = await this.cacheManager.get<AuctionDetail[]>(cacheKey);
    if (cachedAuctions) {
        return {
            statusCode: HttpStatus.OK,
            data: cachedAuctions,
            message: 'Auctions retrieved successfully',
          };
    }
    const auctions = await this.auctionModel.find().populate('bids').exec();

    const displayAuctions: AuctionDetail[] = auctions.map(auction => ({
      ...auction.toObject(),
      startTime: formattedDate(auction.startTime),
      endTime: formattedDate(auction.endTime),
    }));

    await this.cacheManager.set(cacheKey, displayAuctions);


    return {
      statusCode: HttpStatus.OK,
      data: displayAuctions,
      message: 'Auctions retrieved successfully',
    };
  }
}
