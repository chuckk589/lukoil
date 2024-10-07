import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/mikroorm/entities/User';

@Injectable()
export class GlobalService {
  constructor(private readonly em: EntityManager) {}

  userRepo = this.em.getRepository(User);

  async findOrCreateUser(chatId: number, username: string) {
    const user = await this.userRepo.findOrCreateByChatId(chatId.toString());
    if (username) {
      user.username = username;
      await this.userRepo.save(user);
    }
    return user;
  }
}
