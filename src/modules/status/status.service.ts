import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { UpdateLocaleDto } from './dto/update-locale.dto';
import i18n from '../bot/middleware/i18n';
import { City } from '../mikroorm/entities/City';
import { RetrieveStatusDto } from './dto/retrieve-status.dto';
import { Locale, UserRole } from '../mikroorm/entities/User';
import { Prize } from '../mikroorm/entities/Prize';
import { LotteryState } from '../mikroorm/entities/Lottery';
import { TicketStatus } from '../mikroorm/entities/Ticket';
import { NotificationStatus } from '../mikroorm/entities/Notification';

@Injectable()
export class StatusService {
  constructor(private readonly em: EntityManager) {}
  async findStatistics() {
    const users: { total: number; date: string }[] = await this.em.execute(`
      select 
        COUNT(u.id) as total, 
        DATE(u.created_at) as date
        from user as u 
      group by date`);
    const checks: { check_total: number; date: string; utm_web: string; utm_telegram: string }[] = await this.em.execute(`
      select 
        DATE(c.created_at) as date, 
        COUNT(c.id) as check_total,
        sum(case when c.utm_source = 'web' then 1 else 0 end) as utm_web,
        sum(case when c.utm_source = 'telegram' then 1 else 0 end) as utm_telegram
        from \`check\` as c 
      group by date`);
    //merge by date

    const dates = [...new Set([...users.map((u) => u.date), ...checks.map((c) => c.date)])];
    const data = dates.map((date) => {
      const user = users.find((u) => u.date == date);
      const check = checks.find((c) => c.date == date);
      return {
        total: user?.total || 0,
        check_total: check?.check_total || 0,
        utm_web: check?.utm_web || 0,
        utm_telegram: check?.utm_telegram || 0,
        date,
      };
    });
    return data;
  }
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
    const prizes = await this.em.find(Prize, {});
    const cities = await this.em.find(City, {});
    const ticket_statuses = {
      pending: 'Ожидает ответа',
      closed: 'Закрыта',
      answered: 'Дан ответ',
    };
    const not_statuses = {
      pending: 'В процессе',
      executed: 'Выполнено',
      cancelled: 'Отменено',
    };
    return {
      lottery_statuses: Object.values(LotteryState).map((status) => new RetrieveStatusDto({ name: status, description: status == 'pending' ? 'Ожидает розыгрыша' : 'Завершена' })),
      locales: Object.values(Locale).map((locale) => new RetrieveStatusDto({ name: locale, description: locale == 'ru' ? 'Русский' : 'Казахский' })),
      roles: Object.values(UserRole).map((role) => new RetrieveStatusDto({ name: role, description: role == 'user' ? 'Пользователь' : 'Администратор' })),
      ticket_statuses: Object.values(TicketStatus).map((status) => new RetrieveStatusDto({ name: status, description: ticket_statuses[status] })),
      cities: cities.map((city) => new RetrieveStatusDto(city)),
      prizes: prizes.map((prize) => new RetrieveStatusDto(prize)),
      not_statuses: Object.values(NotificationStatus).map((status) => new RetrieveStatusDto({ name: status, description: not_statuses[status] })),
    };
  }
}
