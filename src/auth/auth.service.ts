import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { jwtConstants } from './constants';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * This method is used to validate a user (Look him up in db and check his pw). This method
   * will be called from our passport local strategy
   * @param username user to validate
   * @param password pass of the user.
   *
   * @return User data without his pw. TODO Replace this with a dto
   */
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);

    if (user && user.password === password) {
      // extract password from the object and return the rest
      const { password, ...rest } = user;

      return rest;
    }
    return null;
  }

  /**
   * Create a access token and refresh token JWT for the given user.
   * @param user
   */
  async login(user: any) {
    return this.createTokens(user);
  }

  async refresh(userId, refreshToken) {
    const user = this.userService.findOneById(userId);

    // todo: also add hashed rt to user
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    return this.createTokens(user);
  }

  private createTokens(user) {
    const payload = { username: user.username, sub: user.userId };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.accessTokenSecret,
        expiresIn: '15m', // https://github.com/vercel/ms
      }),

      refresh_token: this.jwtService.sign(payload, {
        secret: jwtConstants.refreshTokenSecret,
        expiresIn: '7d', // https://github.com/vercel/ms
      }),
    };
  }

  private async setRefreshTokenHash(userId: number, refreshToken) {
    const [hashedRefreshToken, user] = await Promise.all([
      argon2.hash(refreshToken),
      this.userService.findOneById(userId),
    ]);

    console.log(hashedRefreshToken);
    console.log(user);
  }

  register() {}
}
