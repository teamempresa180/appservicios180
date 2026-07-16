import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '../../modules/core/domain/exceptions/unauthorized.exception';

/**
 * Requires a valid `Bearer` access token (see `JwtStrategy`).
 * Rethrows Passport's own failure as the shared `UnauthorizedException`
 * so `DomainExceptionFilter` produces the same error body shape
 * (`ErrorResponseDto`) as every other 401 in the API, instead of
 * Passport's default Nest `UnauthorizedException` (a different class,
 * from `@nestjs/common`, not caught by `DomainExceptionFilter`).
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = Express.User>(
    err: unknown,
    user: TUser | false,
  ): TUser {
    if (err || !user) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
    return user;
  }
}
