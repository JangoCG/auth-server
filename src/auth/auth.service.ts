import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { jwtConstants } from './constants';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { CreateUserDto } from './model/create-user.dto';
import { User } from '../user/model/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * This method is used to validate a user (Look him up in db and check his pw). This method
   * will be called from our passport local strategy
   * @param email user to validate
   * @param password pass of the user.
   *
   * @return User data without his pw. TODO Replace this with a dto
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    const passwordIsCorrect = await argon2.verify(user.password, password);

    if (user && passwordIsCorrect) {
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
    const tokens = await this.createTokens(user);
    await this.updateRefreshTokenHash(user, tokens.refresh_token);
    return tokens;
  }

  async refresh(userId, refreshToken) {
    const user = await this.userService.findById(userId);

    if (!user || !user.hashedRefreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = this.createTokens(user);
    await this.updateRefreshTokenHash(user, refreshToken);

    return this.createTokens(tokens);
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

  private async updateRefreshTokenHash(
    user: User,
    refreshToken: string,
  ): Promise<void> {
    user.hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateUser(user);
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (user) {
      throw new ConflictException('The e-mail is already taken');
    }
    createUserDto.password = await argon2.hash(createUserDto.password);
    return this.userService.save(createUserDto);
  }
}
