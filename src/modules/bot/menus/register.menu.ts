import { Menu } from '@grammyjs/menu';
import { Keyboard } from 'grammy';
import { Locale } from 'src/modules/mikroorm/entities/User';
import { BaseComposer, BaseMenu, BotContext, BotStep, LOCALES } from '../bot.types';
import { ComposerController, MenuController, Use } from '../common/decorators';
import { label } from '../common/helpers';
import { GlobalService } from '../services/global.service';
import cache from '../common/cache';
import { BotMenus } from '../bot.constants';
import { CITY_COUNT } from 'src/constants';
import { MainMenu } from './main.menu';

@MenuController
export class RegisterMenu extends BaseMenu {
  constructor(private readonly globalService: GlobalService, private readonly mainMenu: MainMenu) {
    super();
  }

  private acceptHandler = async (ctx: BotContext) => {
    ctx.menu.close();
    ctx.session.step = BotStep.city;

    await ctx.reply(ctx.i18n.t('ask_city'), { reply_markup: this.menu });
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

    const msg = await ctx.replyWithPhoto(cache.resolveAsset('about'), { reply_markup: this.mainMenu.getMenu() });
    cache.cacheAsset('about', msg);
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
