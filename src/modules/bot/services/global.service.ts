import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { Locale, User } from 'src/modules/mikroorm/entities/User';
import { BotContext } from '../bot.types';
import { City } from 'src/modules/mikroorm/entities/City';
import { Check } from 'src/modules/mikroorm/entities/Check';
import { Lottery } from 'src/modules/mikroorm/entities/Lottery';
import { Ticket } from 'src/modules/mikroorm/entities/Ticket';
import { RetrieveTicketDto } from 'src/modules/ticket/dto/retrieve-ticket.dto';
import { Code } from 'src/modules/mikroorm/entities/Code';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { Winner } from 'src/modules/mikroorm/entities/Winner';
export type ImportedCheck = {
  BottleNumber: string;
};
@Injectable()
export class GlobalService {
  constructor(private readonly orm: MikroORM, private readonly em: EntityManager) {}

  userRepo = this.orm.em.getRepository(User);
  checkRepo = this.orm.em.getRepository(Check);
  lotRepo = this.orm.em.getRepository(Lottery);
  ticketRepo = this.orm.em.getRepository(Ticket);
  codeRepo = this.orm.em.getRepository(Code);
  winnerRepo = this.orm.em.getRepository(Winner);

  async findUser(chatId: number) {
    return await this.userRepo.findOneByChatId(chatId.toString());
  }
  /**
   *
   * @param ctx
   * @returns true if user is registered, false if not
   */
  async checkUserRegistration(ctx: BotContext): Promise<boolean> {
    //remove non digit characters
    const phone = ctx.message.contact.phone_number.replace(/\D/g, '');

    const user = await this.userRepo.findOneByPhone(phone);

    if (user) {
      user.chatId = ctx.from.id.toString();
      user.username = ctx.from.username;

      await this.userRepo.save(user);

      return true;
    } else {
      return false;
    }
  }
  @CreateRequestContext()
  async uploadCodeForUser(chatId: number, code: string): Promise<Check> {
    const user = await this.userRepo.findOneByChatId(chatId.toString());

    const check = await this.checkRepo.createAndAddCheckForUser(user, code);

    return check;
  }
  @CreateRequestContext()
  async getUserChecks(chatId: number) {
    const user = await this.userRepo.findOneByChatId(chatId.toString());
    await this.userRepo.populate(user, ['checks.winners.lottery.prize']);
    return user.checks?.getItems() || [];
  }
  @CreateRequestContext()
  async getUserWonEntities(chatId: number) {
    const user = await this.userRepo.findOneByChatId(chatId.toString());

    const winners = await this.winnerRepo.findAllForUser(user.id);
    return winners;
  }
  async switchLang(ctx: BotContext, lang: Locale) {
    const user = await this.userRepo.findOneByChatId(ctx.from.id.toString());
    user.locale = lang;
    await this.userRepo.save(user);
  }
  async finishRegistration(ctx: BotContext) {
    const user = new User();
    user.locale = ctx.session.userData.locale as Locale;
    user.phone = ctx.session.userData.phone.replace(/\D/g, '');
    user.username = ctx.from.username;
    user.credentials = ctx.session.userData.credentials;
    user.registered = true;
    user.chatId = ctx.from.id.toString();
    user.city = await this.orm.em.getRepository(City).findOneByName(ctx.session.userData.cityKey);
    await this.userRepo.save(user);
  }
  async getLotteries() {
    return await this.lotRepo.findAllFinished();
  }
  async getUserTickets(chatId: number) {
    const tickets = await this.ticketRepo.findTicketsByChatId(chatId.toString());
    return tickets.map((ticket) => new RetrieveTicketDto(ticket));
  }
  async clean(ctx: BotContext) {
    const user = await this.orm.em.findOneOrFail(User, { chatId: String(ctx.from.id) }, { populate: ['checks.winners', 'tickets.messages'] });
    await this.orm.em.removeAndFlush(user);
  }
}
