import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCheckDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  value: string;
}
