import { BeforeCreate, Collection, Entity, EntityRepositoryType, EventArgs, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { LotteryState, LotteryStatus } from './LotteryStatus';
import { Prize } from './Prize';
import { Winner } from './Winner';
import { BaseRepo } from '../repo/base.repo';
import { CheckState } from './CheckStatus';

@Entity({ repository: () => LotteryRepo })
export class Lottery extends CustomBaseEntity {
  [EntityRepositoryType]?: LotteryRepo;

  @PrimaryKey()
  id!: number;

  @Property()
  start!: Date;

  @Property()
  end!: Date;

  @Property({ default: 0 })
  primaryWinners!: number;

  @Property({ default: 0 })
  reserveWinners!: number;

  @ManyToOne(() => LotteryStatus)
  status!: LotteryStatus;

  @ManyToOne(() => Prize)
  prize!: Prize;

  @OneToMany(() => Winner, (winner) => winner.lottery, { orphanRemoval: true })
  winners = new Collection<Winner>(this);

  @BeforeCreate()
  async beforeCreate(args: EventArgs<Lottery>): Promise<void> {
    if (!this.status) {
      this.status = await args.em.findOne(LotteryStatus, { name: LotteryState.PENDING });
    }
  }
}
export class LotteryRepo extends BaseRepo<Lottery> {
  async findAllFinished() {
    return await this.find(
      {
        status: { name: LotteryState.ENDED },
      },
      {
        populate: ['winners.check', 'winners.check.user', 'prize'],
        refresh: true,
        populateWhere: {
          winners: {
            confirmed: true,
            check: { status: { name: CheckState.APPROVED } },
          },
        },
      },
    );
  }
}
