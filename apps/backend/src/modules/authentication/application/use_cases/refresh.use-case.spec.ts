import { UnauthorizedException } from '../../../core/domain/exceptions/unauthorized.exception';
import { Role } from '../../../../common/auth/role.enum';
import { Identity } from '../../../identity/domain/entities/identity.entity';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../../../identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { InMemoryIdentityRepository } from '../../../identity/application/use_cases/test-support/in-memory-identity.repository';
import { InMemoryProviderRepository } from '../../../provider/application/use_cases/test-support/in-memory-provider.repository';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenId } from '../../domain/value-objects/refresh-token-id.value-object';
import { InMemoryRefreshTokenRepository } from './test-support/in-memory-refresh-token.repository';
import { TokenClaims, TokenService } from '../ports/token.port';
import { RefreshCommand } from '../commands/refresh.command';
import { RefreshUseCase } from './refresh.use-case';

class FakeTokenService implements TokenService {
  private counter = 0;
  public rejectVerify = false;

  signAccessToken(claims: TokenClaims): string {
    return `access:${claims.sub}:${claims.role}:${this.counter++}`;
  }

  signRefreshToken(claims: TokenClaims): string {
    return `refresh:${claims.sub}:${claims.role}:${this.counter++}`;
  }

  verifyAccessToken(token: string): TokenClaims {
    return this.parse(token);
  }

  verifyRefreshToken(token: string): TokenClaims {
    if (this.rejectVerify) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return this.parse(token);
  }

  hashRefreshToken(token: string): string {
    return `hash:${token}`;
  }

  getExpiry(): Date {
    return new Date(Date.now() + 900_000);
  }

  private parse(token: string): TokenClaims {
    const [, sub, role] = token.split(':');
    return { sub, role: role as Role };
  }
}

describe('RefreshUseCase', () => {
  let identityRepository: InMemoryIdentityRepository;
  let providerRepository: InMemoryProviderRepository;
  let refreshTokenRepository: InMemoryRefreshTokenRepository;
  let tokenService: FakeTokenService;
  let useCase: RefreshUseCase;
  let identityId: IdentityId;

  beforeEach(async () => {
    identityRepository = new InMemoryIdentityRepository();
    providerRepository = new InMemoryProviderRepository();
    refreshTokenRepository = new InMemoryRefreshTokenRepository();
    tokenService = new FakeTokenService();

    useCase = new RefreshUseCase(
      tokenService,
      refreshTokenRepository,
      identityRepository,
      providerRepository,
    );

    const now = new Date();
    const identity = new Identity(IdentityId.create(), {
      fullName: 'Owner',
      documentType: DocumentType.NationalId,
      documentNumber: '123456789',
      birthDate: now,
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(identity);
    identityId = identity.id;
  });

  async function seedStoredRefreshToken(
    token: string,
    overrides: { revokedAt?: Date | null; expiresAt?: Date } = {},
  ): Promise<void> {
    const now = new Date();
    await refreshTokenRepository.save(
      new RefreshToken(RefreshTokenId.create(), {
        identityId,
        tokenHash: tokenService.hashRefreshToken(token),
        expiresAt: overrides.expiresAt ?? new Date(now.getTime() + 900_000),
        revokedAt: overrides.revokedAt ?? null,
        createdAt: now,
      }),
    );
  }

  it('issues a new pair and revokes the presented refresh token', async () => {
    const oldToken = `refresh:${identityId.value}:${Role.Customer}:0`;
    await seedStoredRefreshToken(oldToken);

    const result = await useCase.execute(new RefreshCommand(oldToken));

    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).not.toBe(oldToken);

    const oldStored = await refreshTokenRepository.findByTokenHash(
      tokenService.hashRefreshToken(oldToken),
    );
    expect(oldStored?.isRevoked).toBe(true);
  });

  it('throws UnauthorizedException when the token signature is invalid', async () => {
    tokenService.rejectVerify = true;
    await expect(
      useCase.execute(new RefreshCommand('garbage-token')),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when the stored token was already revoked', async () => {
    const token = `refresh:${identityId.value}:${Role.Customer}:0`;
    await seedStoredRefreshToken(token, { revokedAt: new Date() });

    await expect(useCase.execute(new RefreshCommand(token))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws UnauthorizedException when the stored token is expired', async () => {
    const token = `refresh:${identityId.value}:${Role.Customer}:0`;
    await seedStoredRefreshToken(token, {
      expiresAt: new Date(Date.now() - 1000),
    });

    await expect(useCase.execute(new RefreshCommand(token))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws UnauthorizedException when there is no stored token for the hash', async () => {
    const token = `refresh:${identityId.value}:${Role.Customer}:0`;
    await expect(useCase.execute(new RefreshCommand(token))).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
