import { Check } from 'src/modules/mikroorm/entities/Check';
import { BotContext, BotLotteryDto, LOCALES } from '../bot.types';
import i18n from '../middleware/i18n';
import { Locale } from 'src/modules/mikroorm/entities/User';

export function match(key: string): RegExp {
  const locales: string[] = i18n.availableLocales();
  const emojiRegex = /\p{Emoji}/u;
  const regex = new RegExp(
    locales
      .map((l) => {
        let value = `^${i18n.t(l, key)}$`;
        if (emojiRegex.test(value)) {
          value += `|${value.replace(emojiRegex, '')}`;
        }
        return value;
      })
      .join('|'),
  );
  return regex;
}

export const label = (text: LOCALES) => {
  return (ctx: BotContext) => ctx.i18n.t(text);
};

export const checkMessage = (ctx: BotContext, checks: Check[]): string => {
  if (!checks.length) return ctx.i18n.t('no_checks');
  const message = checks.reduce((s, c) => {
    s += `\n${c.fancyId} - ${ctx.i18n.t(c.status.name)}`;
    return s;
  }, ctx.i18n.t('my_checks'));
  return message;
};

// export const accountMessage = (ctx: BotContext, checks: Check[]): string => {
//   let message = ctx.i18n.t('my_checks');
//   if (!checks.length) {
//     message += '\n' + ctx.i18n.t('no_checks') + '\n' + ctx.i18n.t('my_prizes') + '\n' + ctx.i18n.t('no_prizes');
//     return message;
//   }
//   checks.forEach((c) => {
//     message += `\n${c.fancyId} - ${ctx.i18n.t(c.status.name)}`;
//   });
//   message += '\n' + ctx.i18n.t('no_prizes');

//   let won = false;
//   checks.forEach((c) => {
//     const winners = c.winners.getItems();
//     if (winners.length) {
//       won = true;
//       winners.forEach((w) => {
//         message += `\n${w.check.fancyId} - ${ctx.i18n.t(w.lottery.prize.name)}`;
//       });
//     }
//   });
//   if (!won) message += '\n' + ctx.i18n.t('no_prizes');

//   return message;
// };

export const composeMyTicketMessage = (ctx: BotContext): string => {
  const ticketNum = ctx.session.userData.tickets.currentIndex;
  const currentTicket = ctx.session.userData.tickets.data[ticketNum];
  const lastmessage = currentTicket.history[currentTicket.history.length - 1];
  const content =
    `${ctx.i18n.t('ticket_object')}: ${currentTicket.object}\n` +
    `${ctx.i18n.t('ticket_date')}: ${new Date(currentTicket.createdAt).toLocaleString()}\n` +
    `${ctx.i18n.t('ticket_status')}: ${ctx.i18n.t(currentTicket.status)}\n` +
    `${lastmessage ? ctx.i18n.t('ticket_last_message') + '\n' + `[${new Date(lastmessage.createdAt).toLocaleString()}] ${lastmessage.user}: ${lastmessage.message}\n` : ''}\n`;
  const total = `(${ticketNum + 1}/${ctx.session.userData.tickets.data.length})`;
  const message = `${total}\n\n` + content;
  return message;
};

export const prizeMessage = (ctx: BotContext, checks: Check[]): string => {
  const wonChecks = checks.filter((c) => c.winners?.getItems().length);
  if (!wonChecks.length) return ctx.i18n.t('no_prizes');
  return wonChecks.reduce((s: string, c: Check) => {
    s += `\n${c.fancyId} - ${c.winners.getItems().reduce((s, w) => s + ctx.i18n.t(w.lottery.prize.name) + '\n', '')}`;
    return s;
  }, ctx.i18n.t('my_prizes'));
};

export const winnersMessage = (ctx: BotContext): string => {
  return ctx.session.winners.length ? ctx.i18n.t('winners') : ctx.i18n.t('no_winners_yet');
};

export const prizeMessageWeek = (ctx: BotContext, week: number): string => {
  if (!ctx.session.winners.length) return ctx.i18n.t('no_winners_yet');
  const winners = ctx.session.winners.filter((w) => w.week === week);
  return winners.reduce((s: string, c: BotLotteryDto, index: number) => {
    c.winners.forEach((w) => {
      s += `\n${c.date} - ${ctx.i18n.t(c.prize)} - ${w.phone}`;
    });
    if (index < winners.length - 1) s += '\n\n▫️▫️▫️▫️▫️▫️▫️▫️\n\n';
    return s;
  }, '');
};

// // export const checkMessageByCount = (ctx: BotContext, check: CheckData): string => {
// //   const translationKey = check.checkCount < 6 ? `checkAccepted_${check.checkCount}` : 'checkAccepted';
// //   return ctx.i18n.t(translationKey, { id: check.fancyId, count: check.checkCount });
// // };

// export const getRandomArrayValues = (arr: any[], count: number): any[] => {
//   const shuffled = arr.slice(0);
//   const result: any[] = [];
//   while (result.length < count) {
//     const random = Math.floor(Math.random() * shuffled.length);
//     //ensure user can't win twice
//     if (result.some((r) => r.user.id === shuffled[random].user.id)) continue;
//     result.push(shuffled[random]);
//     shuffled.splice(random, 1);
//   }
//   return result;
// };
