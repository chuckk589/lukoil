import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckService } from './check.service';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiResponse } from '@nestjs/swagger';
import { CreateCheckDto } from './dto/create-check.dto';
import { RequestWithUser } from '../auth/auth.types';
import { RetrieveCheckDto } from './dto/retrieve-check.dto';

@Controller({
  path: 'check',
  version: '1',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @Get()
  @ApiExcludeEndpoint()
  findAll() {
    return this.checkService.findAll();
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateCheckDto: UpdateCheckDto) {
  //   return this.checkService.update(+id, updateCheckDto);
  // }

  @Post()
  @ApiResponse({
    description: 'Check created',
    status: 201,
    type: RetrieveCheckDto,
  })
  create(@Body() createCheckDto: CreateCheckDto, @Req() req: RequestWithUser) {
    return this.checkService.create(req.user, createCheckDto);
  }

  @Get('me')
  @ApiResponse({
    description: 'Checks found',
    status: 200,
    type: RetrieveCheckDto,
    isArray: true,
  })
  findAllMe(@Req() req: RequestWithUser) {
    return this.checkService.findAllMe(req.user);
  }
}
