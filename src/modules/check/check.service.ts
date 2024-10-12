import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JWTTokenPayload } from '../auth/auth.types';
import { CreateCheckDto } from './dto/create-check.dto';
import { Check, utmSource } from '../mikroorm/entities/Check';
import { RetrieveCheckDto } from './dto/retrieve-check.dto';
import { MikroORM } from '@mikro-orm/core';
import { User } from '../mikroorm/entities/User';

@Injectable()
export class CheckService {
  //   // const approvedAmmount = user.checks.getItems().filter((check) => check.status.name === CheckState.APPROVED).length;

  constructor(private readonly orm: MikroORM) {}

  async create(reqUser: JWTTokenPayload, createCheckDto: CreateCheckDto) {
    const repo = this.orm.em.getRepository(Check);

    const user = await this.orm.em.getRepository(User).findOneOrFail(reqUser.id);

    const check = await repo.createAndAddCheckForUser(user, createCheckDto.value, utmSource.WEB).catch((er) => {
      throw new HttpException(er.message, HttpStatus.BAD_REQUEST);
    });

    return new RetrieveCheckDto(check);
  }

  async findAllMe(user: JWTTokenPayload) {
    const repo = this.orm.em.getRepository(Check);

    const checks = await repo.findAllForUser(user.id);
    return checks.map((check) => new RetrieveCheckDto(check));
  }
  async findAll() {
    const repo = this.orm.em.getRepository(Check);

    const checks = await repo.findAllChecks();
    return checks.map((check) => new RetrieveCheckDto(check));
  }

  // async update(id: number, updateCheckDto: UpdateCheckDto) {
  //   const user = await this.em.findOneOrFail(User, { checks: { id } }, { populate: ['checks', 'checks.status'] });
  //   const check = user.checks.getItems().find((check) => check.id === id);
  //   // const approvedAmmount = user.checks.getItems().filter((check) => check.status.name === CheckState.APPROVED).length;
  //   const check_status = await this.em.findOneOrFail(CheckStatus, { id: Number(updateCheckDto.status) }, { populate: ['comment', 'translation'] });
  //   let message: string;
  //   if (check_status.name == CheckState.REJECTED) {
  //     // message = i18n.t(check.user.locale, check_status.comment.name, { check_id: check.fancyId });
  //     message = i18n.t(check.user.locale, check_status.translation.name, { check_id: check.fancyId });
  //   } else if (check_status.name == CheckState.APPROVED) {
  //     message = i18n.t(check.user.locale, 'STATUS_APPROVED', {
  //       check_id: check.fancyId,
  //     });
  //   }
  //   if (message) {
  //     this.bot.api.sendMessage(check.user.chatId, message, { parse_mode: 'HTML' }).catch((er) => {});
  //   }
  //   check.status = check_status;
  //   await this.em.persistAndFlush(check);
  //   return new RetrieveCheckDto(check);
  // }
}
