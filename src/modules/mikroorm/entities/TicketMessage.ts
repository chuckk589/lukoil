import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { User } from './User';
import { Ticket } from './Ticket';

@Entity()
export class TicketMessage extends CustomBaseEntity {
  @PrimaryKey()
  id!: number;

  @Property({ length: 512 })
  message!: string;

  @ManyToOne(() => Ticket)
  ticket!: Ticket;

  @ManyToOne(() => User)
  user!: User;
}
