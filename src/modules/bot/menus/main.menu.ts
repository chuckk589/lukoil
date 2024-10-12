import { Menu } from '@grammyjs/menu';
import { Locale } from 'src/modules/mikroorm/entities/User';
import { BaseMenu, BotContext, BotStep, BotWinner } from '../bot.types';
import { MenuController, Use } from '../common/decorators';
import { checkMessage, extractWinnersAndWeeks, label, prizeMessage, winnersMessage } from '../common/helpers';
import { GlobalService } from '../services/global.service';
import cache from '../common/cache';
import { BotMenus } from '../bot.constants';
import { WinnerMenu } from './winner.menu';
import { TicketMenu } from './ticket.menu';
import { Message } from 'grammy/types';

@MenuController
export class MainMenu extends BaseMenu {
  constructor(private readonly globalService: GlobalService, private readonly winMenu: WinnerMenu, private readonly ticketMenu: TicketMenu) {
    super();
  }
  private contactHandler = async (ctx: BotContext) => {
    ctx.session.userData.tickets.data = await this.globalService.getUserTickets(ctx.from.id);
    ctx.session.step = BotStep.tickets;
    await ctx.reply(ctx.i18n.t('help_details'), { reply_markup: this.ticketMenu.getMenu() });
  };
  private winnerHandler = async (ctx: BotContext) => {
    const lotteries = await this.globalService.getLotteries();
    ctx.session.winners = extractWinnersAndWeeks(BotWinner, lotteries);
    await ctx.reply(winnersMessage(ctx), { reply_markup: this.winMenu.getMenu() });
  };
  private prizeHandler = async (ctx: BotContext) => {
    const checks = await this.globalService.getUserWonEntities(ctx.from.id);
    await ctx.reply(prizeMessage(ctx, checks));
  };
  private checksHandler = async (ctx: BotContext) => {
    const checks = await this.globalService.getUserChecks(ctx.from.id);
    await ctx.reply(checkMessage(ctx, checks));
  };
  private aboutHandler = async (ctx: BotContext) => {
    const msg = await ctx.replyWithPhoto(cache.resolveAsset(`about_${ctx.i18n.locale()}`), { caption: ctx.i18n.t('about_details') });
    cache.cacheAsset(`about_${ctx.i18n.locale()}`, msg);
  };
  private rulesHandler = async (ctx: BotContext) => {
    const msg = await ctx.replyWithDocument(cache.resolveAsset(`oferta_${ctx.i18n.locale()}`));
    cache.cacheAsset(`oferta_${ctx.i18n.locale()}`, msg);
  };
  private participateHandler = async (ctx: BotContext) => {
    ctx.session.setStep(BotStep.code);
    await ctx.reply(ctx.i18n.t('participate_details'));
  };
  private langHandler = async (ctx: BotContext) => {
    ctx.session.setStep(BotStep.language);

    const msg = await ctx.editMessageMedia({ caption: ctx.i18n.t('switch_lang_content'), media: cache.resolveAsset(`lang_${ctx.i18n.locale()}`), type: 'photo' });
    cache.cacheAsset(`lang_${ctx.i18n.locale()}`, msg as Message.PhotoMessage);
  };
  private switchLangHandler = async (ctx: BotContext, lang: Locale) => {
    await this.globalService.switchLang(ctx, lang);

    ctx.session.setStep(BotStep.default);

    const msg = await ctx.editMessageMedia({ caption: ctx.i18n.t('main_menu'), media: cache.resolveAsset(`start`), type: 'photo' });
    cache.cacheAsset(`start`, msg as Message.PhotoMessage);
  };

  @Use()
  menu = new Menu<BotContext>(BotMenus.MAIN).dynamic((ctx, range) => {
    if (ctx.session.step == BotStep.default) {
      range.text(label('participate'), this.participateHandler);
      range.text(label('rules'), this.rulesHandler);
      range.row();
      range.text(label('about'), this.aboutHandler);
      range.text(label('my_codes'), this.checksHandler);
      range.row();
      range.text(label('my_prizes'), this.prizeHandler);
      range.text(label('winners'), this.winnerHandler);
      range.row();
      range.text(label('contacts'), this.contactHandler);
      range.text(label('switch_language'), this.langHandler);
    } else if (ctx.session.step == BotStep.language) {
      Object.values(Locale).map((lang) => range.text(label(lang), (ctx) => this.switchLangHandler(ctx, lang)));
    }
  });
}
