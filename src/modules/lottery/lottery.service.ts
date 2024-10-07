import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LotteryService {
  constructor(private readonly em: EntityManager) {}
  // async addWinner(createWinnerDto: CreateWinnerDto, id: number) {
  //   const lottery = await this.em.findOne(Lottery, id, { populate: ['prize', 'winners.check'] });
  //   const where = {
  //     ...(lottery.prize.name == 'PRIZE_WEEKLY'
  //       ? {
  //           createdAt: {
  //             $gte: lottery.start,
  //             $lt: lottery.end,
  //           },
  //           winners: { $eq: null },
  //           user: { $nin: lottery.winners.getItems().map((w) => w.check.user.id) },
  //         }
  //       : {}),
  //   };
  //   const checks = await this.em.find(
  //     Check,
  //     {
  //       ...where,
  //       status: { name: CheckState.APPROVED },
  //     },
  //     { populate: ['winners'] },
  //   );
  //   if (checks.length == 0) {
  //     throw new HttpException(`Нет подходящих чеков`, HttpStatus.BAD_REQUEST);
  //   }
  //   //get random checkk
  //   const winner = getRandomArrayValues(checks, 1)[0];
  //   const newWinner = this.em.create(Winner, {
  //     check: this.em.getReference(Check, winner.id),
  //     primary: createWinnerDto.primary,
  //   });
  //   lottery.winners.add(newWinner);
  //   await this.em.persistAndFlush(lottery);
  //   await wrap(lottery).init(true, ['status.translation.values', 'prize.translation.values', 'winners.check.user']);
  //   return new RetrieveLotteryDto(lottery);
  // }
  // async create(createLotteryDto: CreateLotteryDto): Promise<RetrieveLotteryDto> {
  //   createLotteryDto.reserveWinners = createLotteryDto.primaryWinners;
  //   //should be at least equal
  //   if (createLotteryDto.primaryWinners < createLotteryDto.reserveWinners) {
  //     throw new HttpException(
  //       `Number of primaryWinners should bot be less than reserveWiners , \nPrimary: ${Number(createLotteryDto.primaryWinners)}, \nReserve: ${createLotteryDto.reserveWinners}`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   const requestedPrize = await this.em.findOne(Prize, { id: Number(createLotteryDto.prize) });
  //   const where = {
  //     ...(requestedPrize.name == 'PRIZE_WEEKLY'
  //       ? {
  //           createdAt: {
  //             $gte: createLotteryDto.start,
  //             $lt: createLotteryDto.end,
  //           },
  //           winners: { $eq: null },
  //         }
  //       : {}),
  //   };
  //   const checks = await this.em.find(
  //     Check,
  //     {
  //       ...where,
  //       status: { name: CheckState.APPROVED },
  //     },
  //     { populate: ['winners'] },
  //   );

  //   // if (avaivablePrizes.length < Number(createLotteryDto.primaryWinners)) {
  //   //   throw new HttpException(
  //   //     `Not enough prizes of requested type ${requestedPrize.name}, \nRequested ${Number(
  //   //       createLotteryDto.primaryWinners,
  //   //     )}, \nAvailable: ${avaivablePrizes.length}`,
  //   //     HttpStatus.BAD_REQUEST,
  //   //   );
  //   // }
  //   const totalWinners = Number(createLotteryDto.primaryWinners) + Number(createLotteryDto.reserveWinners);

  //   //count unique users
  //   const users = new Set(checks.map((c) => c.user.id));
  //   if (users.size < totalWinners) {
  //     throw new HttpException(`Not enough users, \nRequested ${totalWinners}, \nAvailable: ${users.size}`, HttpStatus.BAD_REQUEST);
  //   }

  //   if (checks.length < totalWinners) {
  //     throw new HttpException(`Not enough checks, \nRequested ${totalWinners}, \nAvailable: ${checks.length}`, HttpStatus.BAD_REQUEST);
  //   }
  //   const winners = getRandomArrayValues(checks, totalWinners);
  //   const lottery = this.em.create(Lottery, {
  //     primaryWinners: Number(createLotteryDto.primaryWinners),
  //     reserveWinners: Number(createLotteryDto.reserveWinners),
  //     prize: requestedPrize,
  //     end: createLotteryDto.end,
  //     start: createLotteryDto.start,
  //     winners: winners.map((winner, index) =>
  //       this.em.create(Winner, {
  //         check: this.em.getReference(Check, winner.id),
  //         primary: index < Number(createLotteryDto.primaryWinners),
  //       }),
  //     ),
  //   });
  //   await this.em.persistAndFlush(lottery);
  //   await wrap(lottery).init(true, ['status.translation.values', 'prize.translation.values', 'winners.check.user.city.translation.values']);
  //   return new RetrieveLotteryDto(lottery);
  // }

  // async findAll(): Promise<RetrieveLotteryDto[]> {
  //   return (
  //     await this.em.find(
  //       Lottery,
  //       {},
  //       {
  //         populate: ['status.translation.values', 'prize.translation.values', 'winners.check.user'],
  //       },
  //     )
  //   ).map((lottery) => new RetrieveLotteryDto(lottery));
  // }

  // async update(id: number, updateLotteryDto: UpdateLotteryDto) {
  //   const lottery = await this.em.findOne(Lottery, id);
  //   lottery.status = this.em.getReference(LotteryStatus, Number(updateLotteryDto.status));
  //   lottery.start = updateLotteryDto.start;
  //   lottery.end = updateLotteryDto.end;
  //   await this.em.persistAndFlush(lottery);
  //   await wrap(lottery).init(true, ['winners.check.user', 'prize.translation.values']);
  //   return new RetrieveLotteryDto(lottery);
  // }

  // async remove(id: number) {
  //   const lottery = await this.em.find(Lottery, { id }, { populate: ['winners'] });
  //   await this.em.removeAndFlush(lottery);
  // }
}
