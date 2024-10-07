import { Controller, Get } from '@nestjs/common';
import { StatusService } from './status.service';

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
  // @Get('/locales')
  // findLocales() {
  //   return this.statusService.findLocales();
  // }
  // @UseGuards(JwtAuthGuard)
  // @Put('/locales')
  // updateLocales(@Body() updateLocaleDto: UpdateLocaleDto) {
  //   return this.statusService.updateLocales(updateLocaleDto);
  // }
}
