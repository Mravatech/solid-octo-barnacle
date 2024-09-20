import { Controller, Post, Get, Param, Body, BadRequestException } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { CreateBidDto } from './dto/create-bid.dto';
import { isValidObjectId } from 'mongoose';
import { ValidateObjectIdPipe } from '../validators/ValidateObjectIdPipe';
import { Auction } from 'src/types/auction.interface';
@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  // Creates a new auction
  @Post()
  async createAuction(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionService.createAuction(createAuctionDto);
  }

  // Retrieves a specific auction by its ID
  @Get(':id')
  async getAuction(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.auctionService.getAuction(id);
  }

  // Places a bid on a specific auction
  @Post(':id/bid')
  async placeBid(@Param('id', ValidateObjectIdPipe) auctionId: string, @Body() createBidDto: CreateBidDto) {
    return this.auctionService.placeBid(auctionId, createBidDto);
  }

  // Retrieves all auctions
  @Get()
  async getAllAuctions() {
    return this.auctionService.getAllAuctions(); 
  }
}
