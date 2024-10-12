import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseRepo } from '../repo/base.repo';
import { CustomBaseEntity } from './CustomBaseEntity';
export enum PrizeType {
  PRIZE_WEEKLY = 'prize_weekly',
  PRIZE_MAIN = 'prize_main',
}

@Entity()
export class Prize extends CustomBaseEntity {
  @PrimaryKey()
  id!: number;

  @Enum({ items: () => PrizeType })
  prizeType: PrizeType;

  @Property()
  name: string;

  @Property()
  description: string;
}

export class PrizeRepository extends BaseRepo<Prize> {}
