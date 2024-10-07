import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';

export enum LotteryState {
  PENDING = 'PENDING',
  ENDED = 'ENDED',
}

@Entity()
export class LotteryStatus {
  @PrimaryKey()
  id!: number;

  @Enum({ items: () => LotteryState, default: LotteryState.PENDING })
  name: LotteryState;

  @Property()
  description: string;
}
