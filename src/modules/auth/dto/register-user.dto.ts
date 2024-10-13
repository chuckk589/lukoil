import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  phone: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @IsNumber()
  @IsNotEmpty()
  city: number;
}
export class LoginUserDto extends PickType(RegisterUserDto, ['phone', 'password']) {}
export class UserAccessToken {
  access_token: string;
}

export type UserTokenPayload = {
  phone: string;
  id: number;
  credentials: string;
};
