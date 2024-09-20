import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateBidDto {
  @IsNumber({}, { message: 'Bid amount must be a number' })
  @Min(1, { message: 'Bid amount must be at least 1' })
  bidAmount: number;

  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber({}, { message: 'User ID must be a number' })
  userId: number;
}
