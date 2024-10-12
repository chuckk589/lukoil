import { ApiHideProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  object!: string;

  @ApiHideProperty()
  chatId?: string;

  @ApiHideProperty()
  userId?: number;
}
