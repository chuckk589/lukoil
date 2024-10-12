import { Controller, Get, Body, Put, Param, Req, UseGuards, Post } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiResponse } from '@nestjs/swagger';
import { RequestWithUser } from '../auth/auth.types';
import { RetrieveTicketDto } from './dto/retrieve-ticket.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller({
  path: 'ticket',
  version: '1',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  @ApiExcludeEndpoint()
  async findAll() {
    return await this.ticketService.findAll();
  }

  @Put(':id')
  @ApiExcludeEndpoint()
  async update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return await this.ticketService.update(+id, updateTicketDto);
  }

  @Get('me')
  @ApiResponse({
    description: 'Tickets found',
    status: 200,
    type: RetrieveTicketDto,
    isArray: true,
  })
  findAllMe(@Req() req: RequestWithUser) {
    return this.ticketService.findAllMe(req.user);
  }

  @Post()
  @ApiResponse({
    description: 'Ticket created',
    status: 201,
    type: RetrieveTicketDto,
  })
  create(@Req() req: RequestWithUser, @Body() createTicketDto: CreateTicketDto) {
    //http call
    createTicketDto.userId = req.user.id;
    return this.ticketService.create(createTicketDto);
  }
}
