import { BotContext } from '../bot.types';

//import orm from nest
export async function startHandler(ctx: BotContext) {
  ctx.reply('Hello! I am a bot!');
}
