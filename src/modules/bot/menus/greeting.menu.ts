import { Menu } from '@grammyjs/menu';
import { Keyboard } from 'grammy';
import { Locale } from 'src/modules/mikroorm/entities/User';
import { BaseComposer, BotContext, BotStep } from '../bot.types';
import { ComposerController, MenuController, Use } from '../common/decorators';
import { label } from '../common/helpers';
import { GlobalService } from '../services/global.service';
import cache from '../common/cache';

@MenuController
export class AccountComposer extends BaseComposer {
  constructor(private readonly globalService: GlobalService) {
    super();
  }
  @Use()
  menu = new Menu<BotContext>('reg-menu').dynamic((ctx, range) => {
    const locale = ctx.i18n.locale() as Locale;
    switch (ctx.session.step) {
      case BotStep.default: {
        Object.values(Locale).map((lang) =>
          range.text(label({ text: lang as any }), async (ctx) => {
            ctx.i18n.locale(lang);
            ctx.session.step = BotStep.rules;
            ctx.session.userData.locale = lang;
            ctx.menu.close();
            const msg = await ctx.replyWithDocument(cache.resolveAsset(`oferta_${lang}`), { reply_markup: this.menu });
            cache.cacheAsset(`oferta_${lang}`, msg);
          }),
        );
        break;
      }
      case BotStep.rules: {
        range.text(label({ text: LOCALES.accept }), async (ctx) => {
          ctx.menu.close();
          ctx.session.step = BotStep.phone;

          const msg = await ctx.replyWithPhoto(cache.resolveAsset('phone'), { reply_markup: new Keyboard().requestContact(ctx.i18n.t(LOCALES.contact)).oneTime() });
          cache.cacheAsset('phone', msg);
        });
        range.text(label({ text: LOCALES.reject }), async (ctx) => {
          ctx.menu.close();
          ctx.session.step = BotStep.default;
          await ctx.reply(ctx.i18n.t(LOCALES.restricted_rules));
        });
        break;
      }
      case BotStep.age: {
        range.text(label({ text: LOCALES.yes }), async (ctx) => {
          ctx.menu.close();
          ctx.session.step = BotStep.resident;
          await ctx.reply(ctx.i18n.t(LOCALES.ask_residence), { reply_markup: this.menu });
        });
        range.text(label({ text: LOCALES.no }), async (ctx) => {
          ctx.menu.close();
          ctx.session.step = BotStep.default;
          await ctx.reply(ctx.i18n.t(LOCALES.restricted_age));
        });
        break;
      }
      case BotStep.resident: {
        range.text(label({ text: LOCALES.yes }), async (ctx) => {
          ctx.menu.close();
          ctx.session.step = BotStep.name;
          await ctx.reply(ctx.i18n.t(LOCALES.ask_name), { reply_markup: { remove_keyboard: true } });
        });
        range.text(label({ text: LOCALES.no }), async (ctx) => {
          ctx.menu.close();
          ctx.session.step = BotStep.default;
          await ctx.reply(ctx.i18n.t(LOCALES.restricted_residence), { reply_markup: { remove_keyboard: true } });
        });
        break;
      }
      case BotStep.city: {
        this.AppConfigService.cities.map((city, index) => {
          range.text(label({ text: city.translation[locale] as any }), async (ctx) => {
            ctx.session.step = BotStep.default;
            ctx.session.isRegistered = true;
            ctx.session.userData.city_id = city.id;
            ctx.menu.close();
            await this.globalService.finishRegistration(ctx);
            // await ctx.reply(ctx.i18n.t(LOCALES.registered), { reply_markup: mainKeyboard(ctx) });
            const msg = await ctx.replyWithPhoto(cache.resolveAsset('about'), { reply_markup: this.mMenu });
            cache.cacheAsset('about', msg);
          }),
            index % 3 === 0 && range.row();
        });
        break;
      }
    }
    return range;
  });
}
