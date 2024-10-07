import { Controller, UseGuards } from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller({
  path: 'lottery',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class LotteryController {
  constructor(private readonly lotteryService: LotteryService) {}

  // @Post()
  // async create(@Body() createLotteryDto: CreateLotteryDto): Promise<RetrieveLotteryDto> {
  //   return await this.lotteryService.create(createLotteryDto);
  // }
  // @Post(':id/winner')
  // async addWinner(@Body() createWinnerDto: CreateWinnerDto, @Param('id') id: string) {
  //   return await this.lotteryService.addWinner(createWinnerDto, +id);
  // }
  // @Get()
  // findAll() {
  //   return this.lotteryService.findAll();
  // }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateLotteryDto: UpdateLotteryDto) {
  //   return this.lotteryService.update(+id, updateLotteryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.lotteryService.remove(+id);
  // }
}
