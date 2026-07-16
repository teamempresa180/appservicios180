import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenId } from '../../domain/value-objects/refresh-token-id.value-object';
import { InMemoryRefreshTokenRepository } from './test-support/in-memory-refresh-token.repository';
import { TokenClaims, TokenService } from '../ports/token.port';
import { LogoutCommand } from '../commands/logout.command';
import { LogoutUseCase } from './logout.use-case';
import { Role } from '../../../../common/auth/role.enum';

class FakeTokenService implements TokenService {
  signAccessToken(): string {
    return 'unused';
  }
  signRefreshToken(): string {
    return 'unused';
  }
  verifyAccessToken(): TokenClaims {
    return { sub: 'unused', role: Role.Customer };
  }
  verifyRefreshToken(): TokenClaims {
    return { sub: 'unused', role: Role.Customer };
  }
  hashRefreshToken(token: string): string {
    return `hash:${token}`;
  }
  getExpiry(): Date {
    return new Date();
  }
}

describe('LogoutUseCase', () => {
  let refreshTokenRepository: InMemoryRefreshTokenRepository;
  let tokenService: FakeTokenService;
  let useCase: LogoutUseCase;

  beforeEach(() => {
    refreshTokenRepository = new InMemoryRefreshTokenRepository();
    tokenService = new FakeTokenService();
    useCase = new LogoutUseCase(tokenService, refreshTokenRepository);
  });

  it('revokes an existing, not-yet-revoked refresh token', async () => {
    const token = 'a-refresh-token';
    const now = new Date();
    const stored = new RefreshToken(RefreshTokenId.create(), {
      identityId: IdentityId.create(),
      tokenHash: tokenService.hashRefreshToken(token),
      expiresAt: new Date(now.getTime() + 900_000),
      revokedAt: null,
      createdAt: now,
    });
    await refreshTokenRepository.save(stored);

    await useCase.execute(new LogoutCommand(token));

    const found = await refreshTokenRepository.findByTokenHash(
      tokenService.hashRefreshToken(token),
    );
    expect(found?.isRevoked).toBe(true);
  });

  it('is a no-op (does not throw) for an unknown refresh token', async () => {
    await expect(
      useCase.execute(new LogoutCommand('unknown-token')),
    ).resolves.toBeUndefined();
  });

  it('is a no-op (does not throw) for an already-revoked refresh token', async () => {
    const token = 'already-revoked-token';
    const now = new Date();
    await refreshTokenRepository.save(
      new RefreshToken(RefreshTokenId.create(), {
        identityId: IdentityId.create(),
        tokenHash: tokenService.hashRefreshToken(token),
        expiresAt: new Date(now.getTime() + 900_000),
        revokedAt: now,
        createdAt: now,
      }),
    );

    await expect(
      useCase.execute(new LogoutCommand(token)),
    ).resolves.toBeUndefined();
  });
});
