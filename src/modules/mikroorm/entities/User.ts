import { Collection, Entity, EntityRepositoryType, Enum, FilterQuery, ManyToOne, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Check } from './Check';
import { BaseRepo } from '../repo/base.repo';
import { Scope } from '../repo/scope';
import { CustomBaseEntity } from './CustomBaseEntity';
import { City } from './City';
import { Ticket } from './Ticket';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
export enum Locale {
  RU = 'ru',
  KZ = 'kz',
}
export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity({ repository: () => UserRepo })
export class User extends CustomBaseEntity {
  [EntityRepositoryType]?: UserRepo;

  @PrimaryKey()
  id!: number;

  @Unique()
  @Property({ length: 255, nullable: true })
  chatId!: string;

  @Unique()
  @Property({ length: 255, nullable: true })
  username?: string;

  @Property({ length: 255, nullable: true })
  credentials?: string;

  @ManyToOne(() => City, { nullable: true })
  city?: City;

  @Enum({ items: () => Locale, default: Locale.RU })
  locale: Locale;

  @Enum({ items: () => UserRole, default: UserRole.USER })
  role: UserRole;

  @Unique()
  @Property({ nullable: true })
  phone?: string;

  @Property({ default: false })
  registered?: boolean;

  @OneToMany(() => Check, (check) => check.user, { orphanRemoval: true })
  checks = new Collection<Check>(this);

  @OneToMany(() => Ticket, (ticket) => ticket.user, { orphanRemoval: true })
  tickets = new Collection<Ticket>(this);

  @Property({ nullable: true })
  email: string;

  @Property({ nullable: true })
  password: string;

  //FIXME: returns string instead of date
  @Property()
  lastCheckAt = new Date();

  @Property({ default: 0 })
  uploadAttempts: number;
}
export class UserScope extends Scope<User> {
  byChatId(chatId: string): UserScope {
    this.addQuery({ chatId });
    return this;
  }
  byPhone(phone: string): UserScope {
    this.addQuery({ phone });
    return this;
  }
}
export class UserRepo extends BaseRepo<User> {
  findOrCreateByChatId(chatId: string): Promise<User> {
    const scope = new UserScope();
    scope.byChatId(chatId);
    return this.findOneOrCreate(scope.query);
  }
  findOneByPhone(phone: string): Promise<User> {
    const scope = new UserScope();
    scope.byPhone(phone);
    return this.findOne(scope.query);
  }
  findOneByChatId(chatId: string): Promise<User> {
    const scope = new UserScope();
    scope.byChatId(chatId);
    return this.findOne(scope.query);
  }
  async createByPhoneIfNotExists(phone: string): Promise<User> {
    const scope = new UserScope();
    scope.byPhone(phone);
    let user = await this.findOne(scope.query);
    if (user) {
      throw new Error('User already exists');
    }
    user = this.create(Object.assign(new User(), scope.query));
    await this.save(user);
    return user;
  }

  private async findOneOrCreate(query: FilterQuery<User>): Promise<User> {
    let user = await this._em.findOne(User, query);

    if (user) {
      return user;
    }

    user = this.create(Object.assign(new User(), query));

    await this.save(user);

    return user;
  }
}
