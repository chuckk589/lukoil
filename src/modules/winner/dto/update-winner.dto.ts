import { IsBoolean, IsNumberString } from 'class-validator';

export class UpdateWinnerDto {
  @IsBoolean()
  confirmed!: boolean;

  @IsBoolean()
  notified!: boolean;

  @IsBoolean()
  primary!: boolean;
}
