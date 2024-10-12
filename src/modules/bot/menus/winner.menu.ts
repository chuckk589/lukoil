import { Menu } from '@grammyjs/menu';
import { BaseMenu, BotContext } from '../bot.types';
import { MenuController, Use } from '../common/decorators';
import { BotMenus } from '../bot.constants';
import { prizeMessageWeek } from '../common/helpers';

@MenuController
export class WinnerMenu extends BaseMenu {
  constructor() {
    super();
  }

  @Use()
  menu = new Menu<BotContext>(BotMenus.WINNER).dynamic((ctx, range) => {
    const weeks = Array.from(new Set(ctx.session.winners.map((winner) => winner.weekNum)));
    weeks.map((week, idx) => {
      range.text(ctx.i18n.t('week') + ' ' + (idx + 1), async (ctx) => {
        await ctx.reply(prizeMessageWeek(ctx, week));
      });
      if ((idx + 1) % 2 == 0) {
        range.row();
      }
    });
  });
}
