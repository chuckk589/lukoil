import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { Bot } from 'grammy';
import { BOT_NAME, NOTIF_TG_CHILD } from 'src/constants';
import { EntityManager } from '@mikro-orm/mysql';
import { NotificationJobPayload, NotificationType } from '../services/notification-flow.service';
import { BotContext } from 'src/modules/bot/bot.types';

@Processor(NOTIF_TG_CHILD)
export class NotificationConsumerChild extends WorkerHost {
  constructor(@Inject(BOT_NAME) private bot: Bot<BotContext>, private readonly em: EntityManager) {
    super();
  }
  async process(job: Job<NotificationJobPayload<NotificationType> & { recipient: string }, void, string>): Promise<any> {
    console.log(`NOTIF_TG_CHILD process`);

    try {
      if (job.data.method === 'sendMediaGroup') {
        const payload = job.data.payload as NotificationJobPayload<'sendMediaGroup'>['payload'];
        await this.bot.api.sendMediaGroup(job.data.recipient, payload.media);
      } else if (job.data.method === 'sendPhoto') {
        const payload = job.data.payload as NotificationJobPayload<'sendPhoto'>['payload'];
        await this.bot.api.sendPhoto(job.data.recipient, payload.imagePath, { caption: payload.caption, reply_markup: payload.buttons });
      } else if (job.data.method === 'sendMessage') {
        const payload = job.data.payload as NotificationJobPayload<'sendMessage'>['payload'];
        await this.bot.api.sendMessage(job.data.recipient, payload.caption, { reply_markup: payload.buttons });
      }
      return true;
    } catch (error) {
      if (error.error_code == 403 || job.opts.attempts == job.attemptsMade + 1) return false;
      throw error;
    }
  }
}
