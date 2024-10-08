import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { StatusService } from './status.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateLocaleDto } from './dto/update-locale.dto';

@Controller({
  path: 'status',
  version: '1',
})
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  findAll() {
    return this.statusService.findAll();
  }
  @Get('/locales')
  findLocales() {
    return this.statusService.findLocales();
  }
  @UseGuards(JwtAuthGuard)
  @Put('/locales')
  updateLocales(@Body() updateLocaleDto: UpdateLocaleDto) {
    return this.statusService.updateLocales(updateLocaleDto);
  }
}
