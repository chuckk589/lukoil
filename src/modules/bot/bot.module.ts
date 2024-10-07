import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { Bot } from 'grammy';
import { BOT_NAME } from 'src/constants';
import { BotContext } from './bot.types';

export interface GrammyBotOptions {
  token: string;
}

@Global()
@Module({})
export class BotModule {
  public static forRoot(options: GrammyBotOptions): DynamicModule {
    const BotProvider: Provider = {
      provide: BOT_NAME,
      useFactory: async () => await this.createBotFactory(options),
    };

    return {
      module: BotModule,
      providers: [BotProvider],
      exports: [BotProvider],
    };
  }
  static async createBotFactory(options: GrammyBotOptions): Promise<Bot<BotContext>> {
    // // console.log(options);
    // const bot = new Bot<BotContext>(options.token, { ContextConstructor: BotContext });

    // bot.command(BotCommands.START, startHandler);

    // bot.start();
    // return bot;
    return '' as any;
  }
}
