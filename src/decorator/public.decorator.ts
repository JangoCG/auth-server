import { SetMetadata } from '@nestjs/common';

/**
 * This decorator is used to bypass the global AccessTokenJwtGuard. Every Controller annotated with
 * thisdecorater will have isPublic set to true. The AccessTokenJwtGuard will check for this, and
 * allow all requests that have isPublic set to true.
 */
export const Public = () => SetMetadata('isPublic', true);
