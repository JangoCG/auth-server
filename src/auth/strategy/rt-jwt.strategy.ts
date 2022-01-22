import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { ForbiddenException } from '@nestjs/common';

export class RtJwtStrategy extends PassportStrategy(
  Strategy,
  'RefreshTokenJwt',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.refreshTokenSecret,
      // we need access to the jwt in the request. without this options
      // the information is destroyed and not passed to the validate callback
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    // split the authorization header at whitespace and then get the second part (the token)
    // Recall the format of the header is Authorization: Bearer hereIsTheToken
    const refreshToken = req.get('authorization').split(' ')[1];
    console.log({
      ...payload,
      refreshToken,
    });

    if (!refreshToken) {
      throw new ForbiddenException('Refresh token has invalid format');
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
