import { formattedDate } from '../../utils/date-utils';
import { Test, TestingModule } from '@nestjs/testing';
import { AuctionService } from './auction.service';
import { getModelToken } from '@nestjs/mongoose';
import { Auction } from './schemas/auction.schema';
import { Bid } from './schemas/bid.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import moment from 'moment-timezone';


describe('AuctionService', () => {
  let service: AuctionService;
  let auctionModel: any;
  let bidModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionService,
        {
          provide: getModelToken('Auction'),
          useValue: {
            create: jest.fn(),
            findById: jest.fn().mockReturnThis(),
            lean: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn(),
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

  const mockAuction = {
    _id: 'auction1',
    name: 'Auction 1',
    startTime: new Date(Date.now() + 10000), 
    endTime: new Date(Date.now() + 20000),   
    minimumBid: 100,
    minimumAskingPrice: 200,
    bids: [],
    save: jest.fn().mockResolvedValue(undefined),
    toObject: jest.fn().mockReturnThis(),
  };

  const mockBid = {
    _id: 'bid1',
    bidAmount: 150,
    userId: 1,
    auction: 'auction1',
  };

  it('should create a new auction', async () => {
    auctionModel.create.mockResolvedValue(mockAuction);
  
    const result = await service.createAuction({
      name: 'Auction 1',
      startTime: mockAuction.startTime, 
      endTime: mockAuction.endTime,     
      minimumBid: 100,
      minimumAskingPrice: 200,
    });
  
    expect(result).toEqual({
      statusCode: 201,
      data: {
        ...mockAuction,
        startTime: formattedDate(mockAuction.startTime),  
        endTime: formattedDate(mockAuction.endTime),     
      },
      message: 'Auction created successfully',
    });
  
    expect(auctionModel.create).toHaveBeenCalled();
  });
  

  it('should retrieve an auction by id', async () => {
    auctionModel.exec.mockResolvedValue(mockAuction);  

    const result = await service.getAuction('auction1');

    expect(result).toEqual({
      statusCode: 200,
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
    auctionModel.exec.mockResolvedValue(mockAuction);  
    bidModel.create.mockResolvedValue(mockBid);

    jest.advanceTimersByTime(15000); // Simulate time passing for auction open

    const result = await service.placeBid('auction1', {
      bidAmount: 150,
      userId: 1,
    });

    expect(result).toEqual({
      statusCode: 201,
      data: mockBid,
      message: 'Bid placed successfully',
    });
    expect(auctionModel.findById).toHaveBeenCalledWith('auction1');
    expect(bidModel.create).toHaveBeenCalledWith({
      bidAmount: 150,
      userId: 1,
      auction: 'auction1',
    });
    expect(mockAuction.save).toHaveBeenCalled();
  });

  it('should throw an error if auction is not found', async () => {
    auctionModel.exec.mockResolvedValue(null); 

    await expect(service.getAuction('invalidId')).rejects.toThrow(NotFoundException);
  });

  it('should throw an error if the bid is below the minimum', async () => {
    // Mock auction so it's found
    auctionModel.findById.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(mockAuction), 
    });
  
    await expect(
      service.placeBid('auction1', { bidAmount: 50, userId: 1 })
    ).rejects.toThrow(BadRequestException);
  
    expect(auctionModel.findById).toHaveBeenCalledWith('auction1');
  });
  
});
