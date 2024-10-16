import { BotContext, BotStep } from 'src/modules/bot/bot.types';

export default function (ctx: BotContext): BotStep {
  if (ctx.message?.text) {
    return ctx.session.step;
  }
}
