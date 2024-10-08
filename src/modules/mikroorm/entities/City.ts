import { Entity, EntityRepositoryType, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { BaseRepo } from '../repo/base.repo';
import { CustomBaseEntity } from './CustomBaseEntity';

@Entity({ repository: () => CityRepo })
export class City extends CustomBaseEntity {
  [EntityRepositoryType]?: CityRepo;
  @PrimaryKey()
  id!: number;

  @Unique()
  @Property({ length: 255, nullable: true })
  name: string;

  @Property()
  description: string;
}
export class CityRepo extends BaseRepo<City> {
  async findOneByName(name: string) {
    return await this.findOneOrFail({ name });
  }
}
