import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { AuthService } from './auth.service';
import { RefreshTokenJwtGuard } from '../guard/rt-jwt-auth.guard';
import { Public } from '../decorator/public.decorator';
import { CreateUserDto } from './dto/create-account.dto';

@Controller('authentications')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Before a request reaches the controller it has to pass the guard. The LocalAuthGuard is used
   * in this case. That guard itself uses the passport local strategy. That strategy has a validate
   * method, which validates the requests, and builds a user object if the request  is valid and
   * then attaches that user to the request. That is the reason, why I have access to a user object
   * here.
   */
  @Post()
  @Public()
  @UseGuards(LocalAuthGuard)
  public login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('refresh')
  @UseGuards(RefreshTokenJwtGuard)
  public refresh(@Req() req) {
    console.log('req', req.user);
    const userId: string = req.sub; // sub = subject. this is the user id
    const refreshToken: string = req.refreshToken;

    return this.authService.refresh(userId, refreshToken);
  }

  @Public()
  @Post('account')
  public createAccount(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
