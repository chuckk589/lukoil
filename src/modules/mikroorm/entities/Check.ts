import { Collection, DriverException, Entity, EntityRepositoryType, Enum, FilterQuery, ManyToOne, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { User } from './User';
import { Winner } from './Winner';
import { BaseRepo } from '../repo/base.repo';
import { Scope } from '../repo/scope';
import { Code } from './Code';
import { LotteryState } from './Lottery';
import { MAX_CODE_ATTEMPTS } from 'src/constants';

export enum utmSource {
  TELEGRAM = 'telegram',
  WEB = 'web',
}
@Entity({ repository: () => CheckRepository })
export class Check extends CustomBaseEntity {
  [EntityRepositoryType]?: CheckRepository;
  constructor(check?: Partial<Check>) {
    super();
    Object.assign(this, check);
  }
  @PrimaryKey()
  id!: number;

  @Unique()
  @Property({ length: 255 })
  fancyId = Math.random().toString(36).substr(2, 11).toUpperCase();

  // @Property({ length: 255, nullable: true })
  // path!: string;

  @ManyToOne(() => User)
  user!: User;

  // @ManyToOne(() => CheckStatus)
  // status!: CheckStatus;

  @OneToMany(() => Winner, (winner) => winner.check, { orphanRemoval: true })
  winners = new Collection<Winner>(this);

  @ManyToOne(() => Code, { nullable: true })
  code!: Code;

  @Enum({ items: () => utmSource, default: utmSource.TELEGRAM })
  utmSource!: utmSource;
  // @BeforeCreate()
  // async beforeCreate(args: EventArgs<Check>): Promise<void> {
  //   if (!this.status) {
  //     this.status = await args.em.findOne(CheckStatus, { name: CheckState.MODERATED });
  //   }
  // }
}
export class CheckScope extends Scope<Check> {}
export class CheckRepository extends BaseRepo<Check> {
  async createAndAddCheckForUser(user: User, codeValue: string, from: utmSource = utmSource.TELEGRAM) {
    const isSameDay = new Date(user.lastCheckAt).toDateString() === new Date().toDateString();

    user.uploadAttempts++;

    if (!isSameDay) {
      user.lastCheckAt = new Date();
      user.uploadAttempts = 1;
    }

    await this._em.persistAndFlush(user);

    //if same day check if user reached limit
    if (isSameDay && user.uploadAttempts > MAX_CODE_ATTEMPTS) {
      //log possible fraud
      console.warn(`User ${user.id}, ${user.phone}, ${user.chatId} reached max attempts. Attempts: ${user.uploadAttempts}, attempted code: ${codeValue}`);
      throw new Error('max_code_attempts');
    }

    const code = await this._em.getRepository(Code).findOneByValue(codeValue);

    if (!code) throw new Error('code_not_found');
    if (code.isUsed) throw new Error('code_already_used');

    const check = await this.createCheck({ user });
    code.isUsed = true;
    check.code = code;
    check.user = user;
    check.utmSource = from;

    await this.save(check);

    return check;
  }
  async findWonChecksForUserChatId(chatId: string) {
    const checks = await this.find(
      {
        user: { chatId },
        // status: { name: CheckState.APPROVED },
        winners: { confirmed: true, lottery: { status: LotteryState.ENDED } },
      },
      { populate: ['winners.lottery.prize'] },
    );
    return checks;
  }
  async findAllChecks(filters?: { start: Date; end: Date }) {
    const checks = await this._em.find(
      Check,
      {
        ...(filters ? { createdAt: { $gte: filters.start, $lt: filters.end } } : {}),
      },
      { populate: ['user', 'code', 'winners'] },
    );
    return checks;
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
    await this._em.populate(checks, ['code', 'user']);
    return checks;
  }
}
