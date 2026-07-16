import { UnauthorizedException } from '../../modules/core/domain/exceptions/unauthorized.exception';
import { Role } from './role.enum';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  const guard = new JwtAuthGuard();

  it('returns the user when Passport succeeds', () => {
    const user = { id: 'identity-1', role: Role.Customer };
    expect(guard.handleRequest(null, user)).toBe(user);
  });

  it('throws the shared UnauthorizedException when Passport reports an error', () => {
    expect(() => guard.handleRequest(new Error('boom'), false)).toThrow(
      UnauthorizedException,
    );
  });

  it('throws the shared UnauthorizedException when there is no user (expired/invalid token)', () => {
    expect(() => guard.handleRequest(null, false)).toThrow(
      UnauthorizedException,
    );
  });
});
