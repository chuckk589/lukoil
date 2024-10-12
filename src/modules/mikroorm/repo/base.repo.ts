import { EntityRepository } from '@mikro-orm/mysql';
import { FilterQuery } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { CustomBaseEntity } from '../entities/CustomBaseEntity';

export type EntityId = string;

@Injectable()
export class BaseRepo<T extends CustomBaseEntity> extends EntityRepository<T> {
  create(entity: T): T {
    return this._em.create(this.entityName, entity);
  }

  async save(entities: T | T[]): Promise<void> {
    await this._em.persistAndFlush(entities);
  }

  async delete(entities: T | T[]): Promise<void> {
    await this._em.removeAndFlush(entities);
  }

  async findById(id: EntityId): Promise<T> {
    const promise: Promise<T> = this._em.findOneOrFail(this.entityName, id as FilterQuery<T>);
    return promise;
  }
}
