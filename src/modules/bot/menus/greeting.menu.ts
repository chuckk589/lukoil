import { Menu } from '@grammyjs/menu';
import { Keyboard } from 'grammy';
import { Locale } from 'src/modules/mikroorm/entities/User';
import { BaseMenu, BotContext, BotStep } from '../bot.types';
import { MenuController, Use } from '../common/decorators';
import { label } from '../common/helpers';
import cache from '../common/cache';
import { BotMenus } from '../bot.constants';

@MenuController
export class GreetingMenu extends BaseMenu {
  constructor() {
    super();
  }

  @Use()
  menu = new Menu<BotContext>(BotMenus.GREETING).dynamic((ctx, range) => {
    if (ctx.session.step == BotStep.default) {
      range.text(label('register'), this.registerHandler);
      range.text(label('switch_language'), this.langHandler);
    } else if (ctx.session.step == BotStep.language) {
      Object.values(Locale).map((lang) => range.text(label(lang), (ctx) => this.switchLangHandlerLocally(ctx, lang)));
    }
    return range;
  });

  private registerHandler = async (ctx: BotContext) => {
    ctx.menu.close();
    const msg = await ctx.replyWithPhoto(cache.resolveAsset('phone'), { reply_markup: new Keyboard().requestContact(ctx.i18n.t('contact')).oneTime().resized() });
    cache.cacheAsset('phone', msg);
  };
  private langHandler = async (ctx: BotContext) => {
    ctx.session.setStep(BotStep.language);
    await ctx.editMessageCaption({ caption: ctx.i18n.t('switch_lang_content') });
  };
  private switchLangHandlerLocally = async (ctx: BotContext, lang: Locale) => {
    ctx.session.setStep(BotStep.default);

    ctx.i18n.locale(lang);
    ctx.session.userData.locale = lang;

    await ctx.editMessageCaption({ caption: ctx.i18n.t('start') });
  };
}
