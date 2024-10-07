import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { Bot } from 'grammy';
import { BOT_NAME } from 'src/constants';
import { BaseComposer, BotContext } from './bot.types';
import { GlobalComposer } from './composers/global.composer';
import checkTime from './middleware/checkTime';
import i18n from './middleware/i18n';
import { session } from './middleware/session';
import { GlobalService } from './services/global.service';

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
      inject: [GlobalComposer],
    };

    return {
      module: BotModule,
      providers: [BotProvider, GlobalComposer, GlobalService],
      exports: [BotProvider],
    };
  }
  static async createBotFactory(options: GrammyBotOptions, ...composers: BaseComposer[]): Promise<Bot<BotContext>> {
    const bot = new Bot<BotContext>(options.token, { ContextConstructor: BotContext });

    bot.use(session);
    bot.use(checkTime);
    bot.use(i18n.middleware());

    composers?.map((middleware) => bot.use(middleware.getMiddleware()));

    bot.start();

    return bot;
  }
}
