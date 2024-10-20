import { Menu } from '@grammyjs/menu';
import { BaseMenu, BotContext, BotStep, LOCALES } from '../bot.types';
import { MenuController, Use } from '../common/decorators';
import { composeMyTicketMessage, label } from '../common/helpers';
import { GlobalService } from '../services/global.service';
import { BotMenus, FAQ_QUESTION_AMOUNT } from '../bot.constants';
import { TicketStatus } from 'src/modules/mikroorm/entities/Ticket';

@MenuController
export class TicketMenu extends BaseMenu {
  constructor(private readonly globalService: GlobalService) {
    super();
  }

  @Use()
  menu = new Menu<BotContext>(BotMenus.TICKET).dynamic((ctx, range) => {
    const ticket = ctx.currentTicket;
    switch (ctx.session.step) {
      case BotStep.default: {
        const questionKeys = Array.from({ length: FAQ_QUESTION_AMOUNT }, (_, idx) => {
          return 'question_' + (idx + 1);
        });
        for (const key of questionKeys) {
          range.text(label(key as LOCALES), async (ctx) => {
            await ctx.reply(ctx.i18n.t((key + '_answer') as any));
          });
          range.row();
        }
        break;
      }
      case BotStep.tickets: {
        range.text(label('my_tickets'), async (ctx) => {
          const tickets = await this.globalService.getUserTickets(ctx.from.id);
          if (tickets.length == 0) {
            await ctx.answerCallbackQuery({ text: ctx.i18n.t('no_tickets'), show_alert: true });
            return;
          }
          ctx.session.step = BotStep.ticketsEdit;
          ctx.session.userData.tickets.data = tickets;
          ctx.session.userData.tickets.currentIndex = 0;
          await ctx.editMessageText(composeMyTicketMessage(ctx));
        });
        range.text(label('new_ticket'), async (ctx) => {
          ctx.session.step = BotStep.ticketsCreate;
          await ctx.editMessageText(ctx.i18n.t('create_ticket_content'));
        });
        break;
      }
      case BotStep.ticketsEdit: {
        range.text(label('get_ticket_content'), async (ctx) => {
          if (ticket.history.length == 0) {
            await ctx.answerCallbackQuery({ text: ctx.i18n.t('no_messages'), show_alert: true });
            return;
          }
          const message = ticket.history.map((h) => `[${new Date(h.createdAt).toLocaleString()}] ${h.user}: ${h.message}\n`).join('');
          await ctx.reply(message);
        });
        if (ticket.status != TicketStatus.CLOSED) {
          range.text(label('add_ticket_reply'), async (ctx) => {
            ctx.session.step = BotStep.ticketsReply;
            await ctx.reply(ctx.i18n.t('add_ticket_reply_content'));
          });
        }
        range.row();
        range.text(label('cancel'), async (ctx) => {
          ctx.session.step = BotStep.tickets;
          await ctx.editMessageText(ctx.i18n.t('help_details'));
        });
        range.text(label('prev_ticket'), async (ctx) => {
          if (ctx.session.userData.tickets.data.length <= 1) return;
          ctx.setPrevTicket();
          await ctx.editMessageText(composeMyTicketMessage(ctx));
        });
        range.text(label('next_ticket'), async (ctx) => {
          if (ctx.session.userData.tickets.data.length <= 1) return;
          ctx.setNextTicket();
          await ctx.editMessageText(composeMyTicketMessage(ctx));
        });
        break;
      }
      case BotStep.ticketsCreate: {
        range.text(label('cancel'), async (ctx) => {
          ctx.session.step = BotStep.tickets;
          await ctx.editMessageText(ctx.i18n.t('help_details'));
        });
        break;
      }
    }
  });
}
