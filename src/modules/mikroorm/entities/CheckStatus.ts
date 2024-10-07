import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';

export enum CheckState {
  MODERATED = 'moderated',
  REJECTED = 'rejected',
  APPROVED = 'approved',
}

@Entity()
export class CheckStatus {
  @PrimaryKey()
  id!: number;

  @Enum({ items: () => CheckState, default: CheckState.MODERATED })
  name: CheckState;

  @Property({ length: 255 })
  key: string;

  @Property({ length: 255 })
  description: string;
}
