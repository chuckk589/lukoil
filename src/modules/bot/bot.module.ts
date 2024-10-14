import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { Bot } from 'grammy';
import { BOT_NAME } from 'src/constants';
import { BaseComposer, BotContext } from './bot.types';
import { GlobalComposer } from './composers/global.composer';
import checkTime from './middleware/checkTime';
import i18n from './middleware/i18n';
import { session } from './middleware/session';
import { GlobalService } from './services/global.service';
import { GreetingMenu } from './menus/greeting.menu';
import { MainMenu } from './menus/main.menu';
import { RegisterMenu } from './menus/register.menu';
import { WinnerMenu } from './menus/winner.menu';
import { TicketMenu } from './menus/ticket.menu';
import { TicketService } from '../ticket/ticket.service';

export interface GrammyBotOptions {
  token: string;
}

@Global()
@Module({})
export class BotModule {
  public static forRoot(options: GrammyBotOptions): DynamicModule {
    const BotProvider: Provider = {
      provide: BOT_NAME,
      useFactory: async (...composers: BaseComposer[]) => await this.createBotFactory(options, ...composers),
      inject: [TicketMenu, WinnerMenu, GreetingMenu, MainMenu, RegisterMenu, GlobalComposer],
    };
    return {
      module: BotModule,
      providers: [TicketService, BotProvider, TicketMenu, WinnerMenu, GreetingMenu, MainMenu, RegisterMenu, GlobalComposer, GlobalService],
      exports: [BotProvider],
    };
  }
  static async createBotFactory(options: GrammyBotOptions, ...composers: BaseComposer[]): Promise<Bot<BotContext>> {
    const bot = new Bot<BotContext>(options.token, { ContextConstructor: BotContext });

    bot.api.setMyCommands([{ command: 'start', description: 'Меню' }]);

    bot.use(session);
    bot.use(checkTime);
    bot.use(i18n.middleware());
    //TODO: filter and apply menus first
    composers?.map((middleware) => bot.use(middleware.getMiddleware()));

    bot.start();

    return bot;
  }
}
