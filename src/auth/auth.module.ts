import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { AtJwtStrategy } from './strategy/at-jwt.strategy';
import { RtJwtStrategy } from './strategy/rt-jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, AtJwtStrategy, RtJwtStrategy],
  imports: [UserModule, JwtModule.register({})],
})
export class AuthModule {}
