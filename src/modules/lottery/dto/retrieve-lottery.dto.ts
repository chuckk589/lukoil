import { ApiProperty } from '@nestjs/swagger';
import { Lottery } from 'src/modules/mikroorm/entities/Lottery';
import { Winner } from 'src/modules/mikroorm/entities/Winner';

export class RetrieveLotteryDto {
  constructor(lottery: Lottery) {
    this.id = lottery.id;
    this.start = lottery.start;
    this.end = lottery.end;
    // this.status = lottery.status.translation.getLocalizedLabel(Locale.RU);
    // this.prize = lottery.prize.translation.getLocalizedLabel(Locale.RU);
    this.statusId = lottery.status?.id;
    this.prizeId = lottery.prize?.id;
    this.primaryWinners = lottery.primaryWinners;
    this.reserveWinners = lottery.reserveWinners;
    this.createdAt = lottery.createdAt;
    this.winners = lottery.winners
      .getItems()
      .map((winner) => new RetrieveWinnerDto(winner))
      .sort((a, b) => Number(b.primary) - Number(a.primary));
  }
  id: number;
  start: Date;
  end: Date;
  statusId: number;
  prizeId: number;
  primaryWinners: number;
  reserveWinners: number;
  createdAt: Date;
  winners: RetrieveWinnerDto[];
}
export class RetrieveWinnerDto {
  constructor(winner: Winner) {
    this.id = winner.id;
    this.confirmed = winner.confirmed;
    this.notified = winner.notified;
    this.fancyId = winner.check.fancyId;
    this.credentials = winner.check?.user?.credentials || '';
    this.phone = winner.check?.user?.phone || '';
    this.checkPath = winner.check?.path || '';
    this.primary = winner.primary;
    this.prizeId = winner.lottery?.prize?.id;
    this.weekNum = 0;
  }
  @ApiProperty()
  id: number;
  @ApiProperty()
  confirmed: boolean;
  @ApiProperty()
  notified: boolean;
  @ApiProperty()
  primary: boolean;
  @ApiProperty()
  fancyId: string;
  @ApiProperty()
  credentials: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  checkPath: string;
  @ApiProperty()
  prizeId: number;
  @ApiProperty()
  weekNum: number;
}
