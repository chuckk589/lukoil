import { Entity, Property } from '@mikro-orm/core';

@Entity({ abstract: true })
export abstract class CustomBaseEntity {
  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
