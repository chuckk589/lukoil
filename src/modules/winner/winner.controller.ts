import { Controller, Get, UseGuards, Req, Body, Param, Put, Delete } from '@nestjs/common';
import { WinnerService } from './winner.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/auth.types';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiResponse } from '@nestjs/swagger';
import { RetrieveWinnerDto } from '../lottery/dto/retrieve-lottery.dto';
import { UpdateWinnerDto } from './dto/update-winner.dto';

@Controller({
  path: 'winner',
  version: '1',
})
@ApiBearerAuth()
export class WinnerController {
  constructor(private readonly winnerService: WinnerService) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiExcludeEndpoint()
  update(@Param('id') id: string, @Body() updateWinnerDto: UpdateWinnerDto) {
    return this.winnerService.update(+id, updateWinnerDto);
  }

  // @Post(':id/notification')
  // notify(@Param('id') id: string) {
  //   return this.winnerService.sendNotification(+id);
  // }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiExcludeEndpoint()
  remove(@Param('id') id: string) {
    return this.winnerService.remove(+id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    type: RetrieveWinnerDto,
    isArray: true,
  })
  findAllMe(@Req() req: RequestWithUser) {
    return this.winnerService.findAllMe(req.user);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: RetrieveWinnerDto,
  })
  findAll() {
    return this.winnerService.findAll();
  }
}
