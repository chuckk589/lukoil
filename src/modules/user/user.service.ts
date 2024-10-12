import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { MikroORM } from '@mikro-orm/core';
import { User } from '../mikroorm/entities/User';
import { RetrieveUserDto } from './dto/retrieve-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly orm: MikroORM) {}

  async findAll() {
    const users = await this.orm.em.getRepository(User).findAll();
    return users.map((user) => new RetrieveUserDto(user));
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.orm.em.getRepository(User).findOneOrFail(id);
    // user.credentials = updateUserDto.credentials;
    user.locale = updateUserDto.locale;
    user.role = updateUserDto.role;
    user.phone = updateUserDto.phone;
    user.registered = updateUserDto.registered;
    await this.orm.em.getRepository(User).save(user);
    return new RetrieveUserDto(user);
  }
}
