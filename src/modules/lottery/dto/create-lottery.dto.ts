import { IsDateString, IsNumber, IsNumberString } from 'class-validator';

export class CreateLotteryDto {
  @IsNumberString()
  primaryWinners: string;

  // @IsNumberString()
  reserveWinners: string;

  @IsNumber()
  prize: number;

  @IsDateString()
  start: string;

  @IsDateString()
  end: string;
}
