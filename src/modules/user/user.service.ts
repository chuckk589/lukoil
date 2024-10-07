import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { User } from '../mikroorm/entities/User';
import { RetrieveUserDto } from './dto/retrieve-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}

  async findAll() {
    // const users = await this.em.find(User, {}, { populate: ['promo.translation.values'] });
    // return users.map((user) => new RetrieveUserDto(user));
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.em.findOne(User, id);
    user.credentials = updateUserDto.credentials;
    user.locale = updateUserDto.locale;
    user.role = updateUserDto.role;
    user.phone = updateUserDto.phone;
    user.registered = updateUserDto.registered;
    await this.em.persistAndFlush(user);
    return new RetrieveUserDto(user);
  }
}
