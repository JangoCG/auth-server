/**
 * AUth Guard the passport has provided for us
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenJwtGuard extends AuthGuard('RefreshTokenJwt') {}
