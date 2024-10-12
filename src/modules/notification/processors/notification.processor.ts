import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NOTIF_TG } from 'src/constants';
import { Notification, NotificationStatus } from '../../mikroorm/entities/Notification';
import { EntityManager } from '@mikro-orm/mysql';
import { NotificationFlowData } from '../services/notification-flow.service';
import { NotificationFlowService } from '../services/notification-flow.service';
@Processor(NOTIF_TG)
export class NotificationConsumer extends WorkerHost {
  constructor(private readonly em: EntityManager, private readonly notificationFlowService: NotificationFlowService) {
    super();
  }
  async process(job: Job<NotificationFlowData, void, string>): Promise<any> {
    const results = Object.values(await job.getChildrenValues());
    if (job.data.notificationId) {
      const notification = await this.em.findOne(Notification, { id: job.data.notificationId });
      if (notification) {
        notification.status = NotificationStatus.executed;
        notification.delivered = results.filter((r) => r === true).length;
        notification.expected = results.length;
        await this.em.persistAndFlush(notification);
      }
    }
    console.log(`NOTIF_TG process`, results, job.data.notificationId);
    return {};
  }

  // @OnWorkerEvent('active')
  // onActive(job: Job) {
  //   console.log(`NOTIF_TG onActive`, job.name);
  // }
  // @OnWorkerEvent('failed')
  // onError(job: Job, error: Error) {
  //   console.log(`NOTIF_TG error`, error);
  // }
  // @OnWorkerEvent('completed')
  // async onCompleted(job: Job) {
  //   const results = Object.values(await job.getChildrenValues());
  //   console.log(`NOTIF_TG completed`, results);
  // }
}
