import { BeforeCreate, Collection, Entity, EntityRepositoryType, Enum, EventArgs, ManyToOne, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { User } from './User';
import { TicketMessage } from './TicketMessage';
import { BaseRepo } from '../repo/base.repo';

export enum TicketStatus {
  PENDING = 'pending',
  CLOSED = 'closed',
}

@Entity({ repository: () => TicketRepo })
export class Ticket extends CustomBaseEntity {
  [EntityRepositoryType]?: TicketRepo;
  @PrimaryKey()
  id!: number;

  @Property({ length: 512 })
  object!: string;

  @ManyToOne(() => User)
  user!: User;

  @Enum({ items: () => TicketStatus, default: TicketStatus.PENDING })
  status: TicketStatus;

  @OneToMany(() => TicketMessage, (message) => message.ticket, { orphanRemoval: true })
  messages = new Collection<TicketMessage>(this);
}
export class TicketRepo extends BaseRepo<Ticket> {
  async findTicketsByChatId(chatId: string) {
    return await this.find({ user: { chatId } }, { populate: ['user', 'messages.user'] });
  }
}
