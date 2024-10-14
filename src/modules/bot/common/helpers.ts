import { Check } from 'src/modules/mikroorm/entities/Check';
import { BotContext, BotWinner, LOCALES } from '../bot.types';
import i18n from '../middleware/i18n';
import { Lottery } from 'src/modules/mikroorm/entities/Lottery';
import { RetrieveWinnerDto } from 'src/modules/lottery/dto/retrieve-lottery.dto';
import { DateTime } from 'luxon';
import { Winner } from 'src/modules/mikroorm/entities/Winner';

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
  if (!checks.length) return ctx.i18n.t('no_codes');
  const message = checks.reduce((s, c) => {
    s += `\n${c.code.value}`;
    return s;
  }, ctx.i18n.t('my_codes'));
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

export const prizeMessage = (ctx: BotContext, checks: Winner[]): string => {
  if (!checks.length) return ctx.i18n.t('no_prizes');
  return checks.reduce((s: string, w: Winner) => {
    s += `\n${w.check.fancyId} - ${ctx.i18n.t(w.lottery.prize.prizeType as LOCALES)}`;
    return s;
  }, ctx.i18n.t('my_prizes'));
};

export const winnersMessage = (ctx: BotContext): string => {
  return ctx.session.winners.length ? ctx.i18n.t('winners') : ctx.i18n.t('no_winners_yet');
};

export const prizeMessageWeek = (ctx: BotContext, week: number): string => {
  const winners = ctx.session.winners.filter((w) => w.weekNum == week);
  return winners.reduce((s: string, c: BotWinner) => {
    s += `\n${c.date} - ${ctx.i18n.t(c.prize as LOCALES)} - ${c.phone}`;
    return s;
  }, '');
};
export const extractWinnersAndWeeks = <T extends RetrieveWinnerDto | BotWinner>(type: { new (dto: Winner): T }, lotteries: Lottery[]): T[] => {
  const winners: T[] = [];
  lotteries.forEach((l) => {
    const week = DateTime.fromJSDate(l.start).weekNumber;
    const _winners = l.winners.getItems();
    for (const w of _winners) {
      const winner = new type(w);
      winner.weekNum = week;
      if (type.name == 'BotWinner') {
        (winner as BotWinner).date = DateTime.fromJSDate(l.start).toFormat('dd.LL.yyyy');
        (winner as BotWinner).prize = l.prize.prizeType;
      }
      winners.push(winner);
    }
  });
  winners.sort((a, b) => a.weekNum - b.weekNum);
  const weeks = Array.from(new Set(winners.map((w) => w.weekNum)));
  return winners.map((w) => ({ ...w, weekNum: weeks.indexOf(w.weekNum) + 1 }));
};

export const getRandomArrayValues = (arr: any[], count: number): any[] => {
  const shuffled = arr.slice(0);
  const result: any[] = [];
  while (result.length < count) {
    const random = Math.floor(Math.random() * shuffled.length);
    //ensure user can't win twice
    // if (result.some((r) => r.user.id === shuffled[random].user.id)) continue;
    result.push(shuffled[random]);
    shuffled.splice(random, 1);
  }
  return result;
};
