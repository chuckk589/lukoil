import { session as session_ } from 'grammy';
import { BotContext, BotStep, Session } from '../bot.types';

const initial = (): Session => ({
  menuId: undefined,
  bulkId: undefined,
  step: BotStep.default,
  winners: [],
  userData: { tickets: { data: [], currentIndex: 0 }, locale: 'ru' },
  setStep(step: BotStep) {
    this.step = step;
  },
});

function getSessionKey(ctx: BotContext): string | undefined {
  return ctx.from?.id.toString();
}

export const session = session_({
  initial: initial,
  getSessionKey: getSessionKey,
});
