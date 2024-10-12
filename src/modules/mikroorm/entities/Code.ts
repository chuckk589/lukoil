import { Entity, EntityRepositoryType, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { BaseRepo } from '../repo/base.repo';

@Entity({ repository: () => CodeRepo })
export class Code extends CustomBaseEntity {
  [EntityRepositoryType]?: CodeRepo;

  @PrimaryKey()
  id!: number;

  @Unique()
  @Property({ length: 255 })
  value: string;

  @Property({ default: false })
  isUsed: boolean;
}

export class CodeRepo extends BaseRepo<Code> {
  findOneByValue(value: string) {
    return this.findOne({ value });
  }
}
