import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CheckModule } from './modules/check/check.module';
import { LotteryModule } from './modules/lottery/lottery.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { StatusModule } from './modules/status/status.module';
import { WinnerModule } from './modules/winner/winner.module';
import { NotificationModule } from './modules/notification/notification.module';
import MikroORMOptions from 'src/configs/mikro-orm.config';
import * as Joi from 'joi';
import { TicketModule } from './modules/ticket/ticket.module';
import { BullModule } from '@nestjs/bullmq';
import { RedisConnectionOptions } from './configs/redis.config';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from './modules/bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.lukoil.env'],
      validationSchema: Joi.object({
        jwt_secret: Joi.string().required(),
        NODE_ENV: Joi.string().valid('dev', 'prod'),
        PORT: Joi.number().default(3000),
        DB_NAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_URL: Joi.string().required(),
        REDIS_PASSWORD: Joi.string().required(),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_HOST: Joi.string().required(),
        BOT_TOKEN: Joi.string().required(),
      }),
    }),
    MikroOrmModule.forRoot(MikroORMOptions),
    BotModule.forRoot({ token: process.env.BOT_TOKEN }),
    BullModule.forRoot({ connection: RedisConnectionOptions }),
    // ServeStaticModule.forRoot({ rootPath: join(__dirname, './', 'public/') }),
    UserModule,
    LotteryModule,
    CheckModule,
    AuthModule,
    StatusModule,
    WinnerModule,
    TicketModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
