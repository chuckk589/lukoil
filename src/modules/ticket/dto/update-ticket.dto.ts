import { ApiHideProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { TicketStatus } from 'src/modules/mikroorm/entities/Ticket';

export class UpdateTicketDto {
  @IsString()
  @IsOptional()
  response!: string;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsNumber()
  @IsOptional()
  @ApiHideProperty()
  chatId?: number;

  @IsNumberString()
  @IsOptional()
  @ApiHideProperty()
  userId?: string;
}
