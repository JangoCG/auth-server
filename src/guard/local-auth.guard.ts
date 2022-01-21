import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//  Passport local strategy has a default name of 'local'. I reference that
//  name here in the AuthGuard param
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
