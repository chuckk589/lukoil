import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phone: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
export class LoginUserDto extends RegisterUserDto {}
export class UserAccessToken {
  @ApiProperty()
  access_token: string;
}
