import { Test, TestingModule } from '@nestjs/testing';
import { AuctionService } from './auction.service';
import { getModelToken } from '@nestjs/mongoose';
import { Auction } from './schemas/auction.schema';
import { Bid } from './schemas/bid.schema';
import { BadRequestException, NotFoundException, HttpStatus } from '@nestjs/common';
import { formattedDate } from '../../utils/date-utils';


describe('AuctionService', () => {
  let service: AuctionService;
  let auctionModel: any;
  let bidModel: any;

  const mockAuction = {
    _id: 'auction1',
    name: 'Auction 1',
    startTime: new Date(),
    endTime: new Date(Date.now() + 60 * 1000),
    minimumBid: 100,
    minimumAskingPrice: 200,
    bids: [],
    save: jest.fn().mockResolvedValue(true),
    toObject: jest.fn().mockReturnThis(),
  };

  const mockBid = {
    _id: 'bid1',
    bidAmount: 150,
    userId: 1,
    auction: 'auction1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionService,
        {
          provide: getModelToken('Auction'),
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getModelToken('Bid'),
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuctionService>(AuctionService);
    auctionModel = module.get(getModelToken('Auction'));
    bidModel = module.get(getModelToken('Bid'));

    jest.useFakeTimers();

  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should create a new auction', async () => {
    auctionModel.create.mockResolvedValue(mockAuction);

    const createAuctionDto = {
      name: 'Auction 1',
      startTime: mockAuction.startTime,
      endTime: mockAuction.endTime,
      minimumBid: 100,
      minimumAskingPrice: 200,
    };

    const result = await service.createAuction(createAuctionDto);

    expect(result).toEqual({
      statusCode: 201,
      data: {
        ...mockAuction,
        startTime: formattedDate(mockAuction.startTime),  
        endTime: formattedDate(mockAuction.endTime),     
      },
      message: 'Auction created successfully',
    });

    expect(auctionModel.create).toHaveBeenCalledWith(createAuctionDto);
  });

  it('should retrieve an auction by id', async () => {
    jest.spyOn(auctionModel, 'findById').mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockAuction),
    }));

    const result = await service.getAuction('auction1');

    expect(result).toEqual({
      statusCode: HttpStatus.OK,
      data: {
        ...mockAuction,
        startTime: formattedDate(mockAuction.startTime),  
        endTime: formattedDate(mockAuction.endTime),     
      },
      message: 'Auction retrieved successfully',
    });
    expect(auctionModel.findById).toHaveBeenCalledWith('auction1');
  });

  it('should place a bid on an auction', async () => {
    jest.spyOn(auctionModel, 'findById').mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(mockAuction),
    }));
    jest.spyOn(bidModel, 'create').mockResolvedValue(mockBid);

    jest.advanceTimersByTime(15000); // Simulate time passing for auction open


    const createBidDto = { bidAmount: 150, userId: 1 };
    const result = await service.placeBid('auction1', createBidDto);

    expect(result).toEqual({
      statusCode: HttpStatus.CREATED,
      data: mockBid,
      message: 'Bid placed successfully',
    });
    expect(auctionModel.findById).toHaveBeenCalledWith('auction1');
    expect(bidModel.create).toHaveBeenCalledWith(expect.objectContaining(createBidDto));
    expect(mockAuction.save).toHaveBeenCalled(); // Mocked save method
  });

  it('should throw a NotFoundException if auction is not found', async () => {
    jest.spyOn(auctionModel, 'findById').mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    }));

    await expect(service.getAuction('invalidId')).rejects.toThrow(NotFoundException);
  });

  it('should throw a BadRequestException if bid amount is below the minimum', async () => {
    jest.spyOn(auctionModel, 'findById').mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(mockAuction),
    }));

    const createBidDto = { bidAmount: 50, userId: 1 }; // Invalid bid
    await expect(service.placeBid('auction1', createBidDto)).rejects.toThrow(BadRequestException);
  });
});
