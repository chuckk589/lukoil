import { Collection, DriverException, Entity, EntityRepositoryType, Enum, FilterQuery, ManyToOne, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { User } from './User';
import { Winner } from './Winner';
import { BaseRepo } from '../repo/base.repo';
import { Scope } from '../repo/scope';
import { Code } from './Code';
import { LotteryState } from './Lottery';
import { MAX_CODE_ATTEMPTS, MAX_CODE_PER_PROMO, MAX_CODE_PER_WEEK } from 'src/modules/bot/bot.constants';
import * as luxon from 'luxon';

type GetCheckFilters = { start?: Date; end?: Date; notWinner?: boolean; notBlocked?: boolean };

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
// export class UserScope extends Scope<User> {
//   byChatId(chatId: string): UserScope {
//     this.addQuery({ chatId });
//     return this;
//   }
//   byPhone(phone: string): UserScope {
//     this.addQuery({ phone });
//     return this;
//   }
// }
export class CheckScope extends Scope<Check> {
  byDateRange(filter: GetCheckFilters): CheckScope {
    if (filter.start && filter.end) {
      this.addQuery({ createdAt: { $gte: filter.start, $lt: filter.end } });
    }
    return this;
  }
  byWinState(filter: GetCheckFilters): CheckScope {
    if (filter.notWinner === true) {
      this.addQuery({ winners: { $eq: null } });
    }
    return this;
  }
  byBlockedState(filter: GetCheckFilters): CheckScope {
    if (filter.notBlocked ?? true) {
      this.addQuery({ user: { isBlocked: !filter.notBlocked } });
    }
    return this;
  }
}
export class CheckRepository extends BaseRepo<Check> {
  async findOneByCode(code: string) {
    return this.findOne({ code: { value: code } });
  }
  async createAndAddCheckForUser(user: User, codeValue: string, from: utmSource = utmSource.TELEGRAM) {
    const weekNow = luxon.DateTime.now().weekNumber;
    const isSameWeek = luxon.DateTime.fromJSDate(new Date(user.lastCheckAt)).weekNumber == weekNow;

    user.uploadAttempts++;

    if (!isSameWeek) {
      user.lastCheckAt = new Date();
      user.uploadAttempts = 1;
    }

    await this._em.persistAndFlush(user);

    if (!user.checks.isInitialized()) {
      await user.checks.init();
    }

    //apply rules to the same week events
    if (isSameWeek) {
      //if same day check if user reached limit, log possible fraud
      if (user.uploadAttempts > MAX_CODE_ATTEMPTS) {
        console.warn(`User ${user.id}, ${user.phone}, ${user.chatId} reached max attempts. Attempts: ${user.uploadAttempts}, attempted code: ${codeValue}`);
        throw new Error('max_code_attempts');
      }

      const checksThisWeek = user.checks.filter((check) => luxon.DateTime.fromJSDate(new Date(check.createdAt)).weekNumber === weekNow);

      if (checksThisWeek.length >= MAX_CODE_PER_WEEK) {
        throw new Error('max_code_attempts');
      }

      if (user.checks.length >= MAX_CODE_PER_PROMO) {
        throw new Error('max_code_attempts');
      }
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
  async findAllChecks(filters: GetCheckFilters = {}): Promise<Check[]> {
    const scope = new CheckScope() //
      .byDateRange(filters)
      .byWinState(filters)
      .byBlockedState(filters)
      .allowEmptyQuery(true);
    const checks = await this._em.find(Check, scope.query, { populate: ['user', 'code', 'winners'] });
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
