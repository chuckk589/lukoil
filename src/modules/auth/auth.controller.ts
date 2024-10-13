import { LoginUserDto, RegisterUserDto, UserAccessToken } from './dto/register-user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // @UseGuards(LocalAuthGuard)
  // @Post('admin')
  // async admin(@Req() req: any) {
  //   return this.authService.admin(req.user);
  // }

  @Post('register')
  @ApiResponse({
    description: 'User registered',
    type: UserAccessToken,
    status: 201,
  })
  async register(@Body() registerUserDto: RegisterUserDto): Promise<UserAccessToken> {
    return await this.authService.register(registerUserDto);
  }

  @Post('login')
  @ApiResponse({
    description: 'User logged in',
    type: UserAccessToken,
    status: 201,
  })
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserAccessToken> {
    return await this.authService.login(loginUserDto);
  }

  @Post('reset')
  @ApiResponse({
    description: 'Password reset',
    type: UserAccessToken,
    status: 201,
  })
  async reset(@Body() loginUserDto: LoginUserDto): Promise<UserAccessToken> {
    return await this.authService.reset(loginUserDto);
  }
}
