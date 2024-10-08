import { Router } from '@grammyjs/router';
import { BotCommands } from '../bot.constants';
import { BaseComposer, BotContext, BotStep } from '../bot.types';
import cache from '../common/cache';
import { Command, ComposerController, On, Use } from '../common/decorators';
import { GreetingMenu } from '../menus/greeting.menu';
import { MainMenu } from '../menus/main.menu';
import { GlobalService } from '../services/global.service';
import { RegisterMenu } from '../menus/register.menu';
import { TicketService } from 'src/modules/ticket/ticket.service';

@ComposerController
export class GlobalComposer extends BaseComposer {
  constructor(
    private readonly ticketService: TicketService,
    private readonly globalService: GlobalService,
    private readonly greetingMenu: GreetingMenu,
    private readonly mainMenu: MainMenu,
    private readonly regMenu: RegisterMenu,
  ) {
    super();
  }
  private contactHandler = async (ctx: BotContext) => {
    const isPresent = await this.globalService.checkUserRegistration(ctx);
    if (isPresent) {
      ctx.session.setStep(BotStep.default);

      await ctx.reply(ctx.i18n.t('welcome_back'), { reply_markup: this.mainMenu.getMenu() });
    } else {
      ctx.session.userData.phone = ctx.message.contact.phone_number;
      ctx.session.step = BotStep.name;

      await ctx.reply(ctx.i18n.t('ask_name'), { reply_markup: this.regMenu.getMenu() });
    }
  };

  private nameHandler = async (ctx: BotContext) => {
    ctx.session.userData.credentials = ctx.message.text;
    ctx.session.setStep(BotStep.rules);

    const msg = await ctx.replyWithDocument(cache.resolveAsset(`oferta_${ctx.i18n.locale()}`), { caption: ctx.i18n.t('rules'), reply_markup: this.regMenu.getMenu() });
    cache.cacheAsset(`oferta_${ctx.i18n.locale()}`, msg);
  };

  private startHandler = async (ctx: BotContext) => {
    ctx.session.setStep(BotStep.default);
    // const user = await this.globalService.findOrCreateUser(ctx.from.id, ctx.from.username);
    const user = await this.globalService.findUser(ctx.from.id);

    if (user) {
      ctx.i18n.locale(user.locale);
      await ctx.reply(ctx.i18n.t('main_menu'), { reply_markup: this.mainMenu.getMenu() });
    } else {
      const msg = await ctx.replyWithPhoto(cache.resolveAsset('start'), { caption: ctx.i18n.t('start'), reply_markup: this.greetingMenu.getMenu() });
      cache.cacheAsset('start', msg);
    }
    // ctx.session.isRegistered = user.registered;
    // ctx.i18n.locale(user.locale);
    // if (user.registered) {
    //   await ctx.reply(ctx.i18n.t('main_menu'), { reply_markup: this.mainMenu.getMenu() });
    // } else {
    // const msg = await ctx.replyWithPhoto(cache.resolveAsset('start'), { reply_markup: this.greetingMenu.getMenu() });
    // cache.cacheAsset('start', msg);
    // }
  };
  private ticketReplyHandler = async (ctx: BotContext) => {
    if (ctx.message) {
      await this.ticketService.update(+ctx.currentTicket.id, {
        response: ctx.message.text,
        chatId: ctx.from.id,
      });
      ctx.session.step = BotStep.ticketsEdit;
      await ctx.reply(ctx.i18n.t('ticket_reply_added'));
    }
  };
  private ticketCreateHandler = async (ctx: BotContext) => {
    if (ctx.message) {
      await this.ticketService.create({ object: ctx.message.text, chatId: ctx.from.id.toString() });
      ctx.session.step = BotStep.default;
      await ctx.reply(ctx.i18n.t('ticket_created'));
    }
  };
  private cleanHandler = async (ctx: BotContext) => {
    await this.globalService.clean(ctx);
    await ctx.reply('Cleaned', { reply_markup: { remove_keyboard: true } });
  };

  @Command(BotCommands.START)
  start = this.startHandler;

  @Command(BotCommands.CLEAN)
  clean = this.cleanHandler;
  @On(':contact')
  contact = async (ctx: BotContext) => {
    if (ctx.session.step == BotStep.default) {
      await this.contactHandler(ctx);
    }
  };

  @Use()
  router = new Router<BotContext>((ctx: BotContext) => ctx.session.step).route(BotStep.name, this.nameHandler).route(BotStep.ticketsReply, this.ticketReplyHandler).route(BotStep.ticketsCreate, this.ticketCreateHandler);
}
