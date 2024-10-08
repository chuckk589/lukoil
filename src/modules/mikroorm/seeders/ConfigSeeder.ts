import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Config } from '../entities/Config';
import { City } from '../entities/City';
import { CheckState, CheckStatus } from '../entities/CheckStatus';
import { LotteryState, LotteryStatus } from '../entities/LotteryStatus';
import { Prize, PrizeType } from '../entities/Prize';

export class ConfigSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.create(Config, {
      name: 'ADMIN_PASSCODE',
      value: '$2a$12$rok.MCu02SSWKkSuTRhwdudPl4N6QQl0sRRBf1vyTaxLiw14TwR6i',
    });

    em.create(Config, {
      name: 'PROMO_END_DATE',
      value: '04-01-2024',
    });

    for (let i = 0; i < cities.length; i++) {
      em.create(City, {
        name: 'CITY_' + (i + 1),
        description: cities[i].desc,
      });
    }

    for (let i = 0; i < checkstatuses.length; i++) {
      em.create(CheckStatus, {
        name: checkstatuses[i].stat,
        key: checkstatuses[i].key,
        description: checkstatuses[i].desc,
      });
    }

    for (let i = 0; i < lotterystatus.length; i++) {
      em.create(LotteryStatus, {
        name: lotterystatus[i].stat,
        description: lotterystatus[i].desc,
      });
    }

    em.create(Prize, {
      name: PrizeType.PRIZE_WEEKLY,
      description: 'Еженедельный приз',
    });

    em.create(Prize, {
      name: PrizeType.PRIZE_MAIN,
      description: 'Главный приз',
    });
  }
}

const cities = [
  { desc: 'Алматы', kz: 'Алматы' },
  { desc: 'Астана', kz: 'Астана' },
  { desc: 'Шымкент', kz: 'Шымкент' },
  { desc: 'Тараз', kz: 'Тараз' },
  { desc: 'Актау', kz: 'Ақтау' },
  { desc: 'Атырау', kz: 'Атырау' },
  { desc: 'Караганда', kz: 'Қарағанды' },
  { desc: 'Семей', kz: 'Семей' },
  { desc: 'Петропавловск', kz: 'Петропавл' },
  { desc: 'Кызылорда', kz: 'Қызылорда' },
  { desc: 'Павлодар', kz: 'Павлодар' },
  { desc: 'Туркестан', kz: 'Түркістан' },
  { desc: 'Уральск', kz: 'Орал' },
  { desc: 'Усть-Каменогорск', kz: 'Өскемен' },
  { desc: 'Другое', kz: 'басқа' },
];

const checkstatuses = [
  {
    key: 'MODERATED',
    stat: CheckState.MODERATED,
    desc: 'Ожидает проверки',
  },
  {
    key: 'REJECT_REASON_1',
    stat: CheckState.REJECTED,
    desc: 'Отсутствуют необходимые SKU',
  },
  {
    key: 'REJECT_REASON_2',
    stat: CheckState.REJECTED,
    desc: 'Чек не читабелен',
  },
  {
    key: 'REJECT_REASON_3',
    stat: CheckState.REJECTED,
    desc: 'Загружено не фото чека',
  },
  {
    key: 'REJECT_REASON_4',
    stat: CheckState.REJECTED,
    desc: 'Чек был загружен ранее',
  },
  {
    key: 'REJECT_REASON_5',
    stat: CheckState.REJECTED,
    desc: 'Кол-во продукции не соответствует чеку',
  },
  {
    key: 'STATUS_APPROVED',
    stat: CheckState.APPROVED,
    desc: 'Подтвержден',
  },
];
const lotterystatus = [
  { desc: 'Ожидает розыгрыша', stat: LotteryState.PENDING },
  { desc: 'Проведена', stat: LotteryState.ENDED },
];
