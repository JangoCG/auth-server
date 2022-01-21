import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { Injectable } from '@nestjs/common';

/**
 * JWT Strategy for Access Tokens.
 */
@Injectable()
export class AtJwtStrategy extends PassportStrategy(
  Strategy,
  'AccessTokenJwt',
) {
  constructor() {
    // The JWT is extracted from the header, then the signature will be verified with the secret
    // provided in the config object and if it is correct, the payload is passed to the validate
    // method (validate callback)
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.accessTokenSecret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload.username,
    };
  }
}
