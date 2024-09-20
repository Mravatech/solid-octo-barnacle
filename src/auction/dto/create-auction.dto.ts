import { IsNotEmpty, IsNumber, Min, Validate } from 'class-validator';
import { IsAfterStartTime } from '../../validators/is-after-start-time.validator';
import { IsStartTimeInFuture } from '../../validators/is-start-time-in-future.validator';

export class CreateAuctionDto {
  @IsNotEmpty({ message: 'Auction name is required' })
  name: string;

  @IsNotEmpty({ message: 'Start time is required' })
  @Validate(IsStartTimeInFuture, {
    message: 'Start time must be in the future and in format YYYY-MM-DD HH:mm A',
  })
  startTime: Date; 

  @IsNotEmpty({ message: 'End time is required' })
  @Validate(IsAfterStartTime, {
    message: 'End time must be after start time and in format YYYY-MM-DD HH:mm A',
  })
  endTime: Date;

  @IsNumber({}, { message: 'Minimum bid must be a number' })
  @Min(1, { message: 'Minimum bid must be at least 1' })
  minimumBid: number;

  @IsNumber({}, { message: 'Minimum asking price must be a number' })
  @Min(1, { message: 'Minimum asking price must be at least 1' })
  minimumAskingPrice: number;
}
