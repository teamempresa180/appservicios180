import { Role } from './role.enum';

/** Shape attached to `req.user` by `JwtStrategy` once a request passes `JwtAuthGuard`. */
export interface AuthenticatedUser {
  id: string;
  role: Role;
}
