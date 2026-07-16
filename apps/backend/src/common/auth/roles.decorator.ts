import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';

export const ROLES_KEY = 'roles';

/** Restricts an endpoint to the listed roles — combine with `@UseGuards(JwtAuthGuard, RolesGuard)`. */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
