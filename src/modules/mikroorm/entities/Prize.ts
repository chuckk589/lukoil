import { Entity, Enum, PrimaryKey, Property, Unique } from '@mikro-orm/core';
export enum PrizeType {
  PRIZE_WEEKLY = 'prize_weekly',
  PRIZE_MAIN = 'prize_main',
}

@Entity()
export class Prize {
  @PrimaryKey()
  id!: number;

  @Enum({ items: () => PrizeType })
  name: PrizeType;

  @Property()
  description: string;
}
