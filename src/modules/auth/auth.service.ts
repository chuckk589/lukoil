import { EntityManager } from '@mikro-orm/core';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hashSync } from 'bcrypt';
import { LoginUserDto, RegisterUserDto, UserAccessToken, UserTokenPayload } from './dto/register-user.dto';
import { User } from '../mikroorm/entities/User';
import { City } from '../mikroorm/entities/City';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly em: EntityManager, private readonly configService: ConfigService) {}

  async reset(loginUserDto: LoginUserDto): Promise<UserAccessToken> {
    const repo = this.em.getRepository(User);

    const phone = loginUserDto.phone.replace(/\D/g, '');

    if (phone.length == 0) throw new HttpException('Invalid phone number', 400);

    const user = await repo.findOneByPhone(phone);

    if (!user) throw new HttpException('User not found', 404);

    user.password = hashSync(loginUserDto.password, 10);

    await repo.save(user);

    const payload: UserTokenPayload = { phone: user.phone, id: user.id, credentials: user.credentials };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const repo = this.em.getRepository(User);

    const phone = loginUserDto.phone.replace(/\D/g, '');

    if (phone.length == 0) throw new HttpException('Invalid phone number', 400);

    const user = await repo.findOneByPhone(phone);

    if (!user) throw new HttpException('User not found', 404);

    const valid = await compare(loginUserDto.password, user.password);

    if (!valid) throw new HttpException('Invalid password', 400);

    const payload: UserTokenPayload = { phone: user.phone, id: user.id, credentials: user.credentials };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(body: RegisterUserDto) {
    const repo = this.em.getRepository(User);

    const phone = body.phone.replace(/\D/g, '');

    if (phone.length == 0) throw new HttpException('Invalid phone number', 400);

    const user = await repo.createByPhoneIfNotExists(phone).catch((e) => {
      throw new HttpException('User already exists', 400);
    });

    const city = await this.em
      .getRepository(City)
      .findOneOrFail(body.city)
      .catch((e) => {
        throw new HttpException('City not found', 404);
      });

    user.password = hashSync(body.password, 10);
    user.credentials = body.lastName + ' ' + body.name;
    user.city = city;

    await repo.save(user);

    const payload: UserTokenPayload = { phone: user.phone, id: user.id, credentials: user.credentials };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
