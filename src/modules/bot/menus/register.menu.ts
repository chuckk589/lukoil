import { Menu } from '@grammyjs/menu';
import { BaseMenu, BotContext, BotStep, LOCALES } from '../bot.types';
import { MenuController, Use } from '../common/decorators';
import { label } from '../common/helpers';
import { GlobalService } from '../services/global.service';
import cache from '../common/cache';
import { BotMenus, CITY_COUNT } from '../bot.constants';
import { MainMenu } from './main.menu';

@MenuController
export class RegisterMenu extends BaseMenu {
  constructor(private readonly globalService: GlobalService, private readonly mainMenu: MainMenu) {
    super();
  }

  private acceptHandler = async (ctx: BotContext) => {
    ctx.menu.close();
    ctx.session.step = BotStep.city;

    const msg = await ctx.replyWithPhoto(cache.resolveAsset('city_' + ctx.i18n.locale()), { caption: ctx.i18n.t('ask_city'), reply_markup: this.menu });
    cache.cacheAsset('city_' + ctx.i18n.locale(), msg);
  };
  private rejectHandler = async (ctx: BotContext) => {
    ctx.menu.close();
    ctx.session.step = BotStep.default;
    await ctx.reply(ctx.i18n.t('restricted_rules'));
  };
  private cityHandler = async (ctx: BotContext, city: string) => {
    ctx.session.step = BotStep.default;
    ctx.session.userData.cityKey = city;
    ctx.menu.close();

    await this.globalService.finishRegistration(ctx);

    const msg = await ctx.replyWithPhoto(cache.resolveAsset(`start_${ctx.i18n.locale()}`), { reply_markup: this.mainMenu.getMenu() });
    cache.cacheAsset(`start_${ctx.i18n.locale()}`, msg);
  };

  @Use()
  menu = new Menu<BotContext>(BotMenus.REGISTER).dynamic((ctx, range) => {
    if (ctx.session.step == BotStep.rules) {
      range.text(label('accept'), this.acceptHandler);
      range.text(label('reject'), this.rejectHandler);
    } else if (ctx.session.step == BotStep.city) {
      const cityKeys = Array.from({ length: CITY_COUNT }, (_, idx) => {
        return ('CITY_' + (idx + 1)) as LOCALES;
      });
      cityKeys.map((city, index) => {
        range.text(label(city), (ctx) => this.cityHandler(ctx, city));
        index % 3 === 0 && range.row();
      });
    }
    return range;
  });
}
