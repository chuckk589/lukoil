import { Entity, EntityRepositoryType, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Check } from './Check';
import { CustomBaseEntity } from './CustomBaseEntity';
import { Lottery, LotteryState } from './Lottery';
import { BaseRepo } from '../repo/base.repo';

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
    return await this.find({ check: { user: { id: userId } }, confirmed: true, lottery: { status: LotteryState.ENDED } }, { populate: ['check.user', 'lottery.prize', 'check.code'] });
  }
}
