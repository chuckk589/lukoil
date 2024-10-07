import { Entity, EntityRepositoryType, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Check } from './Check';
import { CustomBaseEntity } from './CustomBaseEntity';
import { Lottery } from './Lottery';
import { BaseRepo } from '../repo/base.repo';
import { LotteryState } from './LotteryStatus';

@Entity({ repository: () => WinnerRepo })
export class Winner extends CustomBaseEntity {
  [EntityRepositoryType]?: WinnerRepo;

  @PrimaryKey()
  id!: number;

  @Property({ default: false })
  primary!: boolean;

  @Property({ default: false })
  confirmed!: boolean;

  @Property({ default: false })
  notified!: boolean;

  @ManyToOne(() => Lottery)
  lottery!: Lottery;

  @ManyToOne(() => Check)
  check!: Check;
}

export class WinnerRepo extends BaseRepo<Winner> {
  async findAllForUser(userId: number) {
    return await this.find({ check: { user: { id: userId } }, confirmed: true, lottery: { status: { name: LotteryState.ENDED } } }, { populate: ['check.user', 'lottery.status'] });
  }
  async findAllConfirmedAndFinished() {
    // return await this.find({ confirmed: true, lottery: { status: { name: LotteryState.ENDED } } }, { populate: ['check.user', 'lottery.status'] });
  }
}
// {
//   status: { name: LotteryState.ENDED },
// },
// {
//   populate: ['winners.check', 'winners.check.user', 'prize'],
//   refresh: true,
//   populateWhere: {
//     winners: {
//       confirmed: true,
//       check: { status: { name: CheckState.APPROVED } },
//     },
//   },
// },
