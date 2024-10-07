import { session as session_ } from 'grammy';
import { BotContext, BotStep, Session } from '../bot.types';

const initial = (): Session => ({
  menuId: undefined,
  bulkId: undefined,
  step: BotStep.default,
  isRegistered: undefined,
  // checkCount: 0,
  winners: [],
  userData: { tickets: { data: [], currentIndex: 0 } },
});

function getSessionKey(ctx: BotContext): string | undefined {
  return ctx.from?.id.toString();
}

export const session = session_({
  initial: initial,
  getSessionKey: getSessionKey,
});
