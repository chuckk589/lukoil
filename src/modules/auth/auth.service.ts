import { EntityManager } from '@mikro-orm/core';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hashSync } from 'bcrypt';
import { LoginUserDto, RegisterUserDto } from './dto/register-user.dto';
import { User } from '../mikroorm/entities/User';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly em: EntityManager, private readonly configService: ConfigService) {}

  async login(loginUserDto: LoginUserDto) {
    const repo = this.em.getRepository(User);

    const phone = loginUserDto.phone.replace(/\D/g, '');

    if (phone.length == 0) throw new HttpException('Invalid phone number', 400);

    const user = await repo.findOneByPhone(phone);

    if (!user) throw new HttpException('User not found', 404);

    const valid = await compare(loginUserDto.password, user.password);

    if (!valid) throw new HttpException('Invalid password', 400);

    return {
      access_token: this.jwtService.sign({ phone: user.phone, id: user.id }),
    };
  }

  async register(body: RegisterUserDto) {
    const repo = this.em.getRepository(User);

    const phone = body.phone.replace(/\D/g, '');

    if (phone.length == 0) throw new HttpException('Invalid phone number', 400);

    const user = await repo.createByPhoneIfNotExists(phone).catch((e) => {
      throw new HttpException('User already exists', 400);
    });

    user.password = hashSync(body.password, 10);

    await repo.save(user);

    return {
      access_token: this.jwtService.sign({ phone: user.phone, id: user.id }),
    };
  }

  // async validateUser(pass: string): Promise<any> {
  //   const valid = await compare(pass, this.configService.get<string>('ADMIN_PASSCODE'));
  //   return valid && { username: 'admin' };
  // }

  // async admin(user: { username: string }) {
  //   return {
  //     access_token: this.jwtService.sign(user),
  //   };
  // }
}
