import { NextFunction } from 'grammy';
import { BotContext } from 'src/modules/bot/bot.types';

const now = Date.now() / 1000;

export default async function (ctx: BotContext, next: NextFunction): Promise<void> {
  try {
    const date: number = ctx.msg?.date;
    if (date) {
      if (now < ctx.msg.date) {
        await next();
      }
    } else {
      await next();
    }
  } catch (error) {
    console.log(error);
  }
}
