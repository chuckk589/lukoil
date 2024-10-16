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
import { Message } from 'grammy/types';
import messageNotEmpty from '../middleware/messageNotEmpty';

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

      const msg = await ctx.replyWithPhoto(cache.resolveAsset(`start_${ctx.i18n.locale()}`), { caption: ctx.i18n.t('main_menu'), reply_markup: this.mainMenu.getMenu() });
      cache.cacheAsset(`start_${ctx.i18n.locale()}`, msg as Message.PhotoMessage);
    } else {
      ctx.session.userData.phone = ctx.message.contact.phone_number;
      ctx.session.step = BotStep.name;

      await ctx.reply(ctx.i18n.t('ask_name'), { reply_markup: { remove_keyboard: true } });
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
    const user = await this.globalService.findUser(ctx.from.id);

    if (user) {
      ctx.i18n.locale(user.locale);
      const msg = await ctx.replyWithPhoto(cache.resolveAsset(`start_${ctx.i18n.locale()}`), { caption: ctx.i18n.t('main_menu'), reply_markup: this.mainMenu.getMenu() });
      cache.cacheAsset(`start_${ctx.i18n.locale()}`, msg as Message.PhotoMessage);
    } else {
      const msg = await ctx.replyWithPhoto(cache.resolveAsset(`start_${ctx.i18n.locale()}`), { caption: ctx.i18n.t('start'), reply_markup: this.greetingMenu.getMenu() });
      cache.cacheAsset(`start_${ctx.i18n.locale()}`, msg as Message.PhotoMessage);
    }
  };
  private ticketReplyHandler = async (ctx: BotContext) => {
    await this.ticketService.update(+ctx.currentTicket.id, {
      response: ctx.message.text,
      chatId: ctx.from.id,
    });
    ctx.session.step = BotStep.ticketsEdit;
    await ctx.reply(ctx.i18n.t('ticket_reply_added'));
  };
  private ticketCreateHandler = async (ctx: BotContext) => {
    await this.ticketService.create({ object: ctx.message.text, chatId: ctx.from.id.toString() });
    ctx.session.step = BotStep.default;
    await ctx.reply(ctx.i18n.t('ticket_created'));
  };
  private cleanHandler = async (ctx: BotContext) => {
    await this.globalService.clean(ctx);
    await ctx.reply('Cleaned', { reply_markup: { remove_keyboard: true } });
  };
  private codeHandler = async (ctx: BotContext) => {
    try {
      const check = await this.globalService.uploadCodeForUser(ctx.from.id, ctx.message.text);
      if (check) {
        await ctx.reply(ctx.i18n.t('request_accepted', { check_id: check.fancyId }));
      }
    } catch (error) {
      if (error.message == 'code_not_found' || error.message == 'code_already_used' || error.message == 'max_code_attempts') {
        await ctx.reply(ctx.i18n.t(error.message));
      }
    } finally {
      ctx.session.step = BotStep.default;
    }
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
  router = new Router<BotContext>(messageNotEmpty)
    .route(BotStep.name, this.nameHandler)
    .route(BotStep.ticketsReply, this.ticketReplyHandler)
    .route(BotStep.ticketsCreate, this.ticketCreateHandler)
    .route(BotStep.code, this.codeHandler);
}
