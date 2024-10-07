import { BeforeCreate, Collection, DriverException, Entity, EntityRepositoryType, EventArgs, FilterQuery, ManyToOne, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { CheckState, CheckStatus } from './CheckStatus';
import { CustomBaseEntity } from './CustomBaseEntity';
import { User } from './User';
import { Winner } from './Winner';
import { BaseRepo } from '../repo/base.repo';
import { Scope } from '../repo/scope';

@Entity({ repository: () => CheckRepo })
export class Check extends CustomBaseEntity {
  [EntityRepositoryType]?: CheckRepo;
  constructor(check?: Partial<Check>) {
    super();
    Object.assign(this, check);
  }
  @PrimaryKey()
  id!: number;

  @Unique()
  @Property({ length: 255 })
  fancyId = Math.random().toString(36).substr(2, 11).toUpperCase();

  @Property({ length: 255, nullable: true })
  path!: string;

  @Property({ length: 255 })
  value: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => CheckStatus)
  status!: CheckStatus;

  @OneToMany(() => Winner, (winner) => winner.check, { orphanRemoval: true })
  winners = new Collection<Winner>(this);

  @BeforeCreate()
  async beforeCreate(args: EventArgs<Check>): Promise<void> {
    if (!this.status) {
      this.status = await args.em.findOne(CheckStatus, { name: CheckState.MODERATED });
    }
  }
}
export class CheckScope extends Scope<Check> {}
export class CheckRepo extends BaseRepo<Check> {
  async createCheckForUser(userId: number, value: string) {
    const user = await this._em.findOneOrFail(User, { id: userId });
    const check = await this.createCheck({ user, value });
    return check;
  }
  private async createCheck(payload: FilterQuery<Check>): Promise<Check> {
    try {
      const check = this.create(Object.assign(new Check(), payload));
      await this.save(check);
      return check;
    } catch (error: any) {
      if (error instanceof DriverException && error.code == 'ER_DUP_ENTRY') {
        return await this.createCheck(payload);
      }
    }
  }
  async findAllForUser(userId: number): Promise<Check[]> {
    const checks = await this.find({ user: userId });
    await this._em.populate(checks, ['status']);
    return checks;
  }
}
