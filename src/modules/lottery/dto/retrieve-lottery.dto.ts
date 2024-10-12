import { Lottery } from 'src/modules/mikroorm/entities/Lottery';
import { Winner } from 'src/modules/mikroorm/entities/Winner';

export class RetrieveLotteryDto {
  constructor(lottery: Lottery) {
    this.id = lottery.id;
    this.start = lottery.start;
    this.end = lottery.end;
    this.status = lottery.status;
    this.prizeId = lottery.prize?.id;
    this.primaryWinners = lottery.primaryWinners;
    this.reserveWinners = lottery.reserveWinners;
    this.createdAt = lottery.createdAt;
    this.winners = lottery.winners.getItems().map((winner) => new RetrieveWinnerDto(winner));
  }
  id: number;
  start: Date;
  end: Date;
  status: string;
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
    this.primary = winner.primary;
    this.prizeId = winner.lottery?.prize?.id;
    this.code = winner.check?.code?.value;
  }

  id: number;
  confirmed: boolean;
  notified: boolean;
  primary: boolean;
  fancyId: string;
  credentials: string;
  phone: string;
  prizeId: number;
  weekNum: number;
  code: string;
}
