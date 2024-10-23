import { IsBoolean, IsString } from 'class-validator';

export class CreateWinnerDto {
  @IsBoolean()
  primary!: boolean;

  @IsString()
  code!: string;

  // @IsNumberString()
  // @IsOptional()
  // sharesWith?: string;
}
