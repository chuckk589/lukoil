import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { UpdateLocaleDto } from './dto/update-locale.dto';
import i18n from '../bot/middleware/i18n';
import { CheckStatus } from '../mikroorm/entities/CheckStatus';
import { City } from '../mikroorm/entities/City';
import { LotteryStatus } from '../mikroorm/entities/LotteryStatus';
import { Prize } from '../mikroorm/entities/Prize';
import { RetrieveStatusDto } from './dto/retrieve-status.dto';
import { Locale, UserRole } from '../mikroorm/entities/User';

@Injectable()
export class StatusService {
  constructor(private readonly em: EntityManager) {}
  updateLocales(updateLocaleDto: UpdateLocaleDto) {
    const existingLocale = updateLocaleDto.ru ? 'ru' : 'kz';
    fs.writeFileSync(`./dist/modules/bot/locales/${existingLocale}.json`, JSON.stringify(updateLocaleDto[existingLocale]));
    i18n.loadLocale(existingLocale, updateLocaleDto[existingLocale]);
  }
  async findLocales(): Promise<{ [key: string]: { [key: string]: string } }> {
    return {
      ru: JSON.parse(fs.readFileSync('./dist/modules/bot/locales/ru.json', 'utf8')),
      kz: JSON.parse(fs.readFileSync('./dist/modules/bot/locales/kz.json', 'utf8')),
    };
  }
  async findAll() {
    const check_s = await this.em.find(CheckStatus, {});
    const lottery_s = await this.em.find(LotteryStatus, {});
    const prizes = await this.em.find(Prize, {});
    const cities = await this.em.find(City, {});
    return {
      check_statuses: check_s.map((check_s) => new RetrieveStatusDto(check_s)),
      lottery_statuses: lottery_s.map((lottery_s) => new RetrieveStatusDto(lottery_s)),
      locales: Object.values(Locale).map((locale) => new RetrieveStatusDto({ name: locale, description: locale == 'ru' ? 'Русский' : 'Казахский' })),
      roles: Object.values(UserRole).map((role) => new RetrieveStatusDto({ name: role, description: role == 'user' ? 'Пользователь' : 'Администратор' })),
      cities: cities.map((city) => new RetrieveStatusDto(city)),
      prizes: prizes.map((prize) => new RetrieveStatusDto(prize)),
    };
  }
}
