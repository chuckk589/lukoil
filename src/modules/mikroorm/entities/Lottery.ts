import { Collection, Entity, EntityRepositoryType, Enum, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { Winner } from './Winner';
import { BaseRepo } from '../repo/base.repo';
import { Prize } from './Prize';
export enum LotteryState {
  PENDING = 'pending',
  ENDED = 'ended',
}
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

  @Enum(() => LotteryState)
  status: LotteryState = LotteryState.PENDING;

  @ManyToOne(() => Prize)
  prize!: Prize;

  @OneToMany(() => Winner, (winner) => winner.lottery, { orphanRemoval: true })
  winners = new Collection<Winner>(this);

  // @BeforeCreate()
  // async beforeCreate(args: EventArgs<Lottery>): Promise<void> {
  //   if (!this.status) {
  //     this.status = await args.em.findOne(LotteryStatus, { name: LotteryState.PENDING });
  //   }
  // }
}
export class LotteryRepo extends BaseRepo<Lottery> {
  async findAllFinished() {
    return await this.find(
      {
        status: LotteryState.ENDED,
      },
      {
        populate: ['winners.check.user', 'prize', 'winners.check.code'],
        refresh: true,
        populateWhere: {
          winners: {
            confirmed: true,
            // check: { status: { name: CheckState.APPROVED } },
          },
        },
      },
    );
  }
}
