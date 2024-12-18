import { MikroORM, wrap } from '@mikro-orm/core';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Lottery } from '../mikroorm/entities/Lottery';
import { RetrieveLotteryDto } from './dto/retrieve-lottery.dto';
import { Prize, PrizeType } from '../mikroorm/entities/Prize';
import { Winner } from '../mikroorm/entities/Winner';
import { CreateLotteryDto } from './dto/create-lottery.dto';
import { Check } from '../mikroorm/entities/Check';
import { getRandomArrayValues } from '../bot/common/helpers';
import { UpdateLotteryDto } from './dto/update-lottery.dto';
import { CreateWinnerDto } from '../winner/dto/create-winner.dto';

@Injectable()
export class LotteryService {
  constructor(private readonly orm: MikroORM) {}
  async addWinner(createWinnerDto: CreateWinnerDto, id: number) {
    const check = await this.orm.em.getRepository(Check).findOneByCode(createWinnerDto.code);
    // console.log(check);
    if (!check) {
      throw new HttpException(`Данный код не активирован`, HttpStatus.BAD_REQUEST);
    }
    const lottery = await this.orm.em.getRepository(Lottery).addWinnerByCode(id, check.id, createWinnerDto.primary);
    return new RetrieveLotteryDto(lottery);
    // const lottery = await this.em.findOne(Lottery, id, { populate: ['prize', 'winners.check'] });
    // const where = {
    //   ...(lottery.prize.name == 'PRIZE_WEEKLY'
    //     ? {
    //         createdAt: {
    //           $gte: lottery.start,
    //           $lt: lottery.end,
    //         },
    //         winners: { $eq: null },
    //         user: { $nin: lottery.winners.getItems().map((w) => w.check.user.id) },
    //       }
    //     : {}),
    // };
    // const checks = await this.em.find(
    //   Check,
    //   {
    //     ...where,
    //     status: { name: CheckState.APPROVED },
    //   },
    //   { populate: ['winners'] },
    // );
    // if (checks.length == 0) {
    //   throw new HttpException(`Нет подходящих чеков`, HttpStatus.BAD_REQUEST);
    // }
    // //get random checkk
    // const winner = getRandomArrayValues(checks, 1)[0];
    // const newWinner = this.em.create(Winner, {
    //   check: this.em.getReference(Check, winner.id),
    //   primary: createWinnerDto.primary,
    // });
    // lottery.winners.add(newWinner);
    // await this.em.persistAndFlush(lottery);
    // await wrap(lottery).init(true, ['status.translation.values', 'prize.translation.values', 'winners.check.user']);
    // return new RetrieveLotteryDto(lottery);
  }

  async create(createLotteryDto: CreateLotteryDto): Promise<RetrieveLotteryDto> {
    // createLotteryDto.reserveWinners = createLotteryDto.primaryWinners;
    //should be at least equal
    // if (createLotteryDto.primaryWinners < createLotteryDto.reserveWinners) {
    //   throw new HttpException(
    //     `Number of primaryWinners should bot be less than reserveWiners , \nPrimary: ${Number(createLotteryDto.primaryWinners)}, \nReserve: ${createLotteryDto.reserveWinners}`,
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    const requestedPrize = await this.orm.em.getRepository(Prize).findOne({ id: createLotteryDto.prize });

    const checks = await this.orm.em.getRepository(Check).findAllChecks({
      start: new Date(createLotteryDto.start),
      end: new Date(createLotteryDto.end),
      notWinner: requestedPrize.prizeType == PrizeType.PRIZE_WEEKLY,
      notBlocked: true,
    });

    // if (avaivablePrizes.length < Number(createLotteryDto.primaryWinners)) {
    //   throw new HttpException(
    //     `Not enough prizes of requested type ${requestedPrize.name}, \nRequested ${Number(
    //       createLotteryDto.primaryWinners,
    //     )}, \nAvailable: ${avaivablePrizes.length}`,
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    const totalWinners = Number(createLotteryDto.primaryWinners) + Number(createLotteryDto.reserveWinners);

    //count unique users
    // const users = new Set(checks.map((c) => c.user.id));
    // if (users.size < totalWinners) {
    //   throw new HttpException(`Not enough users, \nRequested ${totalWinners}, \nAvailable: ${users.size}`, HttpStatus.BAD_REQUEST);
    // }

    if (checks.length < totalWinners) {
      throw new HttpException(`Not enough checks, \nRequested ${totalWinners}, \nAvailable: ${checks.length}`, HttpStatus.BAD_REQUEST);
    }
    const winners = getRandomArrayValues(checks, totalWinners);

    const lottery = this.orm.em.create(Lottery, {});

    lottery.primaryWinners = Number(createLotteryDto.primaryWinners);
    lottery.reserveWinners = Number(createLotteryDto.reserveWinners);
    lottery.prize = requestedPrize;
    lottery.end = new Date(createLotteryDto.end);
    lottery.start = new Date(createLotteryDto.start);
    lottery.winners.add(
      winners.map((winner, index) =>
        this.orm.em.create(Winner, {
          check: this.orm.em.getReference(Check, winner.id),
          primary: index < Number(createLotteryDto.primaryWinners),
        }),
      ),
    );
    await this.orm.em.persistAndFlush(lottery);

    await wrap(lottery).init(true, ['prize', 'winners.check.user']);
    return new RetrieveLotteryDto(lottery);
  }

  async findAll(): Promise<RetrieveLotteryDto[]> {
    const lotteries = await this.orm.em.getRepository(Lottery).findAll();
    await this.orm.em.populate(lotteries, ['prize', 'winners.check.user']);
    return lotteries.map((lottery) => new RetrieveLotteryDto(lottery));
  }

  async update(id: number, updateLotteryDto: UpdateLotteryDto) {
    const lottery = await this.orm.em.findOne(Lottery, id);
    lottery.status = updateLotteryDto.status;
    lottery.start = updateLotteryDto.start;
    lottery.end = updateLotteryDto.end;
    await this.orm.em.persistAndFlush(lottery);
    await wrap(lottery).init(true, ['prize', 'winners.check.user']);
    return new RetrieveLotteryDto(lottery);
  }

  async remove(id: number) {
    const lottery = await this.orm.em.find(Lottery, { id }, { populate: ['winners'] });
    await this.orm.em.removeAndFlush(lottery);
  }
}
