import { IsDateString, IsEnum } from 'class-validator';
import { LotteryState } from 'src/modules/mikroorm/entities/Lottery';

export class UpdateLotteryDto {
  @IsEnum(LotteryState)
  status: LotteryState;

  @IsDateString()
  start: Date;

  @IsDateString()
  end: Date;
}
