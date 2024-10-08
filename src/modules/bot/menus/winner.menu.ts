import { Menu } from '@grammyjs/menu';
import { Keyboard } from 'grammy';
import { Locale } from 'src/modules/mikroorm/entities/User';
import { BaseComposer, BaseMenu, BotContext, BotStep } from '../bot.types';
import { ComposerController, MenuController, Use } from '../common/decorators';
import { label, prizeMessageWeek } from '../common/helpers';
import { GlobalService } from '../services/global.service';
import cache from '../common/cache';
import { BotMenus } from '../bot.constants';

@MenuController
export class WinnerMenu extends BaseMenu {
  constructor() {
    super();
  }

  @Use()
  menu = new Menu<BotContext>(BotMenus.WINNER).dynamic((ctx, range) => {
    const weeks = Array.from(new Set(ctx.session.winners.map((winner) => winner.week)));
    weeks.map((week, idx) => {
      range.text(label('week') + ' ' + (idx + 1), async (ctx) => {
        await ctx.reply(prizeMessageWeek(ctx, week));
      });
      if ((idx + 1) % 2 == 0) {
        range.row();
      }
    });
  });
}
