import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { City } from '../entities/City';
import { Prize, PrizeType } from '../entities/Prize';
import { User, UserRole } from '../entities/User';

export class ConfigSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.create(User, {
      username: 'admin',
      chatId: '123456789',
      phone: '123456789',
      password: '$2a$12$NuYIwUgG6MM.mrhTTXBZFeDKpczuiU8r9uJZ4pTn4ky2X31IRWNvS',
      role: UserRole.ADMIN,
    });
    for (let i = 0; i < cities.length; i++) {
      em.create(City, {
        name: 'CITY_' + (i + 1),
        description: cities[i].desc,
      });
    }

    // for (let i = 0; i < checkstatuses.length; i++) {
    //   em.create(CheckStatus, {
    //     name: checkstatuses[i].stat,
    //     key: checkstatuses[i].key,
    //     description: checkstatuses[i].desc,
    //   });
    // }

    for (let i = 0; i < prizes.length; i++) {
      em.create(Prize, {
        prizeType: prizes[i].type,
        description: prizes[i].description,
        name: prizes[i].name,
      });
    }
  }
}
const prizes = [
  { type: PrizeType.PRIZE_WEEKLY, description: 'Сертификаты на 15 000 тг.', name: 'PRIZE_1' },
  { type: PrizeType.PRIZE_WEEKLY, description: 'Сертификаты на 50 000 тг.', name: 'PRIZE_2' },
  { type: PrizeType.PRIZE_WEEKLY, description: 'IPhone 15 Pro', name: 'PRIZE_3' },
  { type: PrizeType.PRIZE_WEEKLY, description: 'Sony Play Station 5', name: 'PRIZE_4' },
  { type: PrizeType.PRIZE_WEEKLY, description: 'Путевка', name: 'PRIZE_5' },
  { type: PrizeType.PRIZE_MAIN, description: 'АВТОМОБИЛЬ', name: 'PRIZE_6' },
];

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

// const checkstatuses = [
//   {
//     key: 'MODERATED',
//     stat: CheckState.MODERATED,
//     desc: 'Ожидает проверки',
//   },
//   {
//     key: 'REJECT_REASON_1',
//     stat: CheckState.REJECTED,
//     desc: 'Отсутствуют необходимые SKU',
//   },
//   {
//     key: 'REJECT_REASON_2',
//     stat: CheckState.REJECTED,
//     desc: 'Чек не читабелен',
//   },
//   {
//     key: 'REJECT_REASON_3',
//     stat: CheckState.REJECTED,
//     desc: 'Загружено не фото чека',
//   },
//   {
//     key: 'REJECT_REASON_4',
//     stat: CheckState.REJECTED,
//     desc: 'Чек был загружен ранее',
//   },
//   {
//     key: 'REJECT_REASON_5',
//     stat: CheckState.REJECTED,
//     desc: 'Кол-во продукции не соответствует чеку',
//   },
//   {
//     key: 'STATUS_APPROVED',
//     stat: CheckState.APPROVED,
//     desc: 'Подтвержден',
//   },
// ];
// const lotterystatus = [
//   { desc: 'Ожидает розыгрыша', stat: LotteryState.PENDING },
//   { desc: 'Проведена', stat: LotteryState.ENDED },
// ];
