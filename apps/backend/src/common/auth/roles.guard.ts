import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ForbiddenException } from '../../modules/core/domain/exceptions/forbidden.exception';
import { AuthenticatedUser } from './authenticated-user.interface';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './role.enum';

/**
 * Enforces `@Roles(...)` metadata. Must run after `JwtAuthGuard` in
 * the same `@UseGuards(...)` list — it reads `request.user`, which
 * `JwtAuthGuard`/`JwtStrategy` populate. If an endpoint has no
 * `@Roles(...)` metadata, this guard allows any authenticated user
 * through (role restriction is opt-in per endpoint).
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as AuthenticatedUser | undefined;
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Requires one of the following roles: ${requiredRoles.join(', ')}`,
      );
    }
    return true;
  }
}
