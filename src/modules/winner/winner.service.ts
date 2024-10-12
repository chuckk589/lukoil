import { MikroORM } from '@mikro-orm/core';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import { BOT_NAME } from 'src/constants';
import { Winner } from '../mikroorm/entities/Winner';
import { UpdateWinnerDto } from './dto/update-winner.dto';
import { BotContext } from '../bot/bot.types';
import { JWTTokenPayload } from '../auth/auth.types';
import { RetrieveWinnerDto } from '../lottery/dto/retrieve-lottery.dto';
import i18n from '../bot/middleware/i18n';
import { Lottery } from '../mikroorm/entities/Lottery';
import { extractWinnersAndWeeks } from '../bot/common/helpers';

@Injectable()
export class WinnerService {
  constructor(private readonly orm: MikroORM, @Inject(BOT_NAME) private bot: Bot<BotContext>) {}
  async remove(id: number) {
    return await this.orm.em.nativeDelete(Winner, { id });
  }
  async sendNotification(id: number) {
    const winner = await this.orm.em.findOneOrFail(Winner, { id }, { populate: ['check.user', 'lottery.prize'] });
    const message = i18n.t(winner.check.user.locale, winner.lottery.prize.prizeType + '_msg', { check_id: winner.check.fancyId });
    await this.bot.api.sendMessage(winner.check.user.chatId, message).then(() => {});
  }
  async findAllMe(user: JWTTokenPayload) {
    const repo = this.orm.em.getRepository(Winner);
    const winners = await repo.findAllForUser(user.id);
    return winners.map((winner) => new RetrieveWinnerDto(winner));
  }

  async findAll() {
    const repo = this.orm.em.getRepository(Lottery);
    const lotteries = await repo.findAllFinished();
    return extractWinnersAndWeeks(RetrieveWinnerDto, lotteries);
  }
  async update(id: number, updateWinnerDto: UpdateWinnerDto) {
    const winner = await this.orm.em.findOne(Winner, id, { populate: ['check.user', 'lottery.prize'] });

    if (!winner.notified && updateWinnerDto.notified === true) {
      await this.sendNotification(id).catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
    }

    winner.confirmed = updateWinnerDto.confirmed;
    winner.notified = updateWinnerDto.notified;
    winner.primary = updateWinnerDto.primary;
    await this.orm.em.persistAndFlush(winner);
    return new RetrieveWinnerDto(winner);
  }
}
