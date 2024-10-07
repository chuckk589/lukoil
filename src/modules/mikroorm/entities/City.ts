import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class City {
  @PrimaryKey()
  id!: number;

  @Unique()
  @Property({ length: 255, nullable: true })
  name: string;

  @Property()
  description: string;
}
