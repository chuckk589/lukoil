import { EntityManager } from '@mikro-orm/mysql';
import { Inject, Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import { BOT_NAME } from 'src/constants';
import { BotContext } from 'src/modules/bot/bot.types';
import { JWTTokenPayload } from '../auth/auth.types';
import { CreateCheckDto } from './dto/create-check.dto';
import { Check } from '../mikroorm/entities/Check';
import { RetrieveCheckDto } from './dto/retrieve-check.dto';

@Injectable()
export class CheckService {
  //   // const approvedAmmount = user.checks.getItems().filter((check) => check.status.name === CheckState.APPROVED).length;

  constructor(private readonly em: EntityManager, @Inject(BOT_NAME) private bot: Bot<BotContext>) {}

  async create(user: JWTTokenPayload, createCheckDto: CreateCheckDto) {
    const repo = this.em.getRepository(Check);
    const check = await repo.createCheckForUser(user.id, createCheckDto.value);
    return new RetrieveCheckDto(check);
  }

  async findAll(user: JWTTokenPayload) {
    const repo = this.em.getRepository(Check);
    const checks = await repo.findAllForUser(user.id);
    return checks.map((check) => new RetrieveCheckDto(check));
  }
  // async findAll(): Promise<RetrieveCheckDto[]> {
  //   return (await this.em.find(Check, {}, { populate: ['user', 'status.translation.values', 'status.comment.values'] })).map((check) => new RetrieveCheckDto(check));
  // }

  // async update(id: number, updateCheckDto: UpdateCheckDto) {
  //   const user = await this.em.findOneOrFail(User, { checks: { id } }, { populate: ['checks', 'checks.status'] });
  //   const check = user.checks.getItems().find((check) => check.id === id);
  //   // const approvedAmmount = user.checks.getItems().filter((check) => check.status.name === CheckState.APPROVED).length;
  //   const check_status = await this.em.findOneOrFail(CheckStatus, { id: Number(updateCheckDto.status) }, { populate: ['comment', 'translation'] });
  //   let message: string;
  //   if (check_status.name == CheckState.REJECTED) {
  //     // message = i18n.t(check.user.locale, check_status.comment.name, { check_id: check.fancyId });
  //     message = i18n.t(check.user.locale, check_status.translation.name, { check_id: check.fancyId });
  //   } else if (check_status.name == CheckState.APPROVED) {
  //     message = i18n.t(check.user.locale, 'STATUS_APPROVED', {
  //       check_id: check.fancyId,
  //     });
  //   }
  //   if (message) {
  //     this.bot.api.sendMessage(check.user.chatId, message, { parse_mode: 'HTML' }).catch((er) => {});
  //   }
  //   check.status = check_status;
  //   await this.em.persistAndFlush(check);
  //   return new RetrieveCheckDto(check);
  // }
}
