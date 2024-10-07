import { I18nContext, TemplateData } from '@grammyjs/i18n';
import { MenuFlavor, MenuControlPanel } from '@grammyjs/menu';
import { Context, SessionFlavor, Api, Composer } from 'grammy';
import { Update, UserFromGetMe } from 'grammy/types';
import { RetrieveTicketDto } from '../ticket/dto/retrieve-ticket.dto';
import { ru } from './helpers/localeDonors/ru';

type I18nContextMapped = Omit<I18nContext, 't'> & { t(resourceKey: LOCALES, templateData?: Readonly<TemplateData>): string };
type I18nContextMappedFlavor = { readonly i18n: I18nContextMapped };
export enum BotStep {
  default = 'default',
  rules = 'rules',
  phone = 'phone',
  age = 'age',
  resident = 'resident',
  name = 'name',
  city = 'city',
  // check = 'check',
  // help = 'help',
  tickets = 'tickets',
  ticketsEdit = 'ticketsEdit',
  ticketsCreate = 'ticketsCreate',
  ticketsReply = 'ticketsReply',
}
export class BaseComposer {
  protected _composer: Composer<any>;
  getMiddleware(): Composer<any> {
    return this._composer;
  }
}
export class BotContext extends Context implements SessionFlavor<Session>, I18nContextMappedFlavor, MenuFlavor {
  constructor(update: Update, api: Api, me: UserFromGetMe) {
    super(update, api, me);
  }
  menu: MenuControlPanel;
  i18n: I18nContextMapped;
  match: string;

  get session(): Session {
    throw new Error('Method not implemented.');
  }
  set session(session: Session) {
    throw new Error('Method not implemented.');
  }

  get currentTicket(): RetrieveTicketDto {
    return this.session.userData.tickets.data[this.session.userData.tickets.currentIndex];
  }
  setNextTicket(): void {
    this.session.userData.tickets.currentIndex = this.session.userData.tickets.currentIndex + 1 >= this.session.userData.tickets.data.length ? 0 : this.session.userData.tickets.currentIndex + 1;
  }
  setPrevTicket(): void {
    this.session.userData.tickets.currentIndex = this.session.userData.tickets.currentIndex - 1 < 0 ? this.session.userData.tickets.data.length - 1 : this.session.userData.tickets.currentIndex - 1;
  }
}
export interface Session {
  bulkId: number;
  menuId: number;
  // checkCount: number;
  step: BotStep;
  isRegistered: boolean;
  //FIXME:
  winners: any[];
  userData: {
    tickets: {
      data: RetrieveTicketDto[];
      currentIndex: number;
    };
    email?: string;
    locale?: string;
    phone?: string;
    credentials?: string;
    city_id?: number;
    promo_id?: number;
  };
  setStep(step: BotStep): void;
}
export type LOCALES = keyof typeof ru;
