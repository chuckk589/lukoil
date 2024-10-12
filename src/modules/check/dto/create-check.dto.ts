import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCheckDto {
  @IsString()
  @IsNotEmpty()
  value: string;
}
