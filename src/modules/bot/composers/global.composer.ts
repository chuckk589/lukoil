import { BotCommands } from '../bot.constants';
import { BaseComposer, BotContext, BotStep } from '../bot.types';
import cache from '../common/cache';
import { Command, ComposerController } from '../common/decorators';
import { GlobalService } from '../services/global.service';

@ComposerController
export class GlobalComposer extends BaseComposer {
  constructor(private readonly globalService: GlobalService) {
    super();
  }

  @Command(BotCommands.START)
  startHandler = async (ctx: BotContext) => {
    ctx.session.setStep(BotStep.default);
    const user = await this.globalService.findOrCreateUser(ctx.from.id, ctx.from.username);
    ctx.session.isRegistered = user.registered;
    ctx.i18n.locale(user.locale);
    console.log('user', user);
    if (user.registered) {
      // await ctx.reply(ctx.i18n.t(LOCALES.main_menu), { reply_markup: mainKeyboard(ctx) });
      // const msg = await ctx.replyWithPhoto(cache.resolveAsset('menu'), { reply_markup: this.mMenu });
      // cache.cacheAsset('menu', msg);
    } else {
      const msg = await ctx.replyWithPhoto(cache.resolveAsset('start'));
      cache.cacheAsset('start', msg);
    }
  };
}
