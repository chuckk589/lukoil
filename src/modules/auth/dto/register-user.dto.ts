import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  phone: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
export class LoginUserDto extends RegisterUserDto {}
export class UserAccessToken {
  access_token: string;
}
