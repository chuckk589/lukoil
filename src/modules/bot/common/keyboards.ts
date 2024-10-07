import { Keyboard } from 'grammy';
import { BotContext } from '../bot.types';

// keyboards
export const mainKeyboard = (ctx: BotContext): Keyboard => {
  return (
    new Keyboard()
      // .text(ctx.i18n.t(ctx.session.checkCount > 0 ? 'participateSecondary' : 'participate'))
      .text(ctx.i18n.t('participate'))
      .row()
      .text(ctx.i18n.t('about'))
      .text(ctx.i18n.t('account'))
      .row()
      .text(ctx.i18n.t('faq'))
      .text(ctx.i18n.t('switchLanguage'))
      .row()
      .text(ctx.i18n.t('rules'))
      .text(ctx.i18n.t('help'))
      .row()
      .text(ctx.i18n.t('winners'))
      .text(ctx.i18n.t('contact'))
  );
};

export const backKeyboard = (ctx: BotContext): Keyboard => {
  return new Keyboard().text(ctx.i18n.t('back'));
};
