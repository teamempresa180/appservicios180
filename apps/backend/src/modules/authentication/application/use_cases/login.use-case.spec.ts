import { UnauthorizedException } from '../../../core/domain/exceptions/unauthorized.exception';
import { Role } from '../../../../common/auth/role.enum';
import { Identity } from '../../../identity/domain/entities/identity.entity';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../../../identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { InMemoryIdentityRepository } from '../../../identity/application/use_cases/test-support/in-memory-identity.repository';
import { InMemoryProviderRepository } from '../../../provider/application/use_cases/test-support/in-memory-provider.repository';
import { Provider } from '../../../provider/domain/entities/provider.entity';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { ProviderStatus } from '../../../provider/domain/value-objects/provider-status.value-object';
import { ProviderType } from '../../../provider/domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../../../provider/domain/value-objects/provider-experience.value-object';
import { ProfileId } from '../../../profiles/domain/value-objects/profile-id.value-object';
import { InMemoryCredentialRepository } from '../../../credentials/application/use_cases/test-support/in-memory-credential.repository';
import { Credential } from '../../../credentials/domain/entities/credential.entity';
import { CredentialId } from '../../../credentials/domain/value-objects/credential-id.value-object';
import { CredentialType } from '../../../credentials/domain/value-objects/credential-type.value-object';
import { CredentialStatus } from '../../../credentials/domain/value-objects/credential-status.value-object';
import { PasswordHasher } from '../../../credentials/application/ports/password-hasher.port';
import { InMemoryAuthenticationRepository } from './test-support/in-memory-authentication.repository';
import { Authentication } from '../../domain/entities/authentication.entity';
import { AuthenticationId } from '../../domain/value-objects/authentication-id.value-object';
import { AuthMethodType } from '../../domain/value-objects/auth-method-type.value-object';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';
import { InMemoryRefreshTokenRepository } from './test-support/in-memory-refresh-token.repository';
import { TokenClaims, TokenService } from '../ports/token.port';
import { LoginCommand } from '../commands/login.command';
import { LoginUseCase } from './login.use-case';

class FakePasswordHasher implements PasswordHasher {
  hash(plainPassword: string): Promise<string> {
    return Promise.resolve(`hashed:${plainPassword}`);
  }

  verify(plainPassword: string, passwordHash: string): Promise<boolean> {
    return Promise.resolve(passwordHash === `hashed:${plainPassword}`);
  }
}

class FakeTokenService implements TokenService {
  private counter = 0;

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

describe('LoginUseCase', () => {
  let identityRepository: InMemoryIdentityRepository;
  let authenticationRepository: InMemoryAuthenticationRepository;
  let credentialRepository: InMemoryCredentialRepository;
  let providerRepository: InMemoryProviderRepository;
  let refreshTokenRepository: InMemoryRefreshTokenRepository;
  let passwordHasher: PasswordHasher;
  let tokenService: TokenService;
  let useCase: LoginUseCase;
  let identityId: IdentityId;
  const documentNumber = '123456789';
  const password = 'Str0ngPassw0rd!';

  beforeEach(async () => {
    identityRepository = new InMemoryIdentityRepository();
    authenticationRepository = new InMemoryAuthenticationRepository();
    credentialRepository = new InMemoryCredentialRepository();
    providerRepository = new InMemoryProviderRepository();
    refreshTokenRepository = new InMemoryRefreshTokenRepository();
    passwordHasher = new FakePasswordHasher();
    tokenService = new FakeTokenService();

    useCase = new LoginUseCase(
      identityRepository,
      authenticationRepository,
      credentialRepository,
      providerRepository,
      passwordHasher,
      tokenService,
      refreshTokenRepository,
    );

    const now = new Date();
    const identity = new Identity(IdentityId.create(), {
      fullName: 'Owner',
      documentType: DocumentType.NationalId,
      documentNumber,
      birthDate: now,
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(identity);
    identityId = identity.id;

    await authenticationRepository.save(
      new Authentication(AuthenticationId.create(), {
        identityId,
        methodType: AuthMethodType.Password,
        status: AuthenticationStatus.Active,
        createdAt: now,
        updatedAt: now,
      }),
    );

    await credentialRepository.save(
      new Credential(CredentialId.create(), {
        identityId,
        type: CredentialType.Password,
        status: CredentialStatus.Active,
        createdAt: now,
        updatedAt: now,
        passwordHash: await passwordHasher.hash(password),
      }),
    );
  });

  it('logs in successfully with valid documentNumber/password and returns Role.Customer without a Provider', async () => {
    const result = await useCase.execute(
      new LoginCommand(documentNumber, password),
    );

    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
    expect(result.tokenType).toBe('Bearer');
    expect(result.role).toBe(Role.Customer);
  });

  it('returns Role.Provider when a Provider record exists for the Identity', async () => {
    const now = new Date();
    await providerRepository.save(
      new Provider(ProviderId.create(), {
        identityId,
        providerProfileId: ProfileId.create(),
        status: ProviderStatus.Active,
        type: ProviderType.Independent,
        experience: ProviderExperience.Intermediate,
        biography: 'Plumber.',
        yearsOfExperience: 5,
        createdAt: now,
        updatedAt: now,
      }),
    );

    const result = await useCase.execute(
      new LoginCommand(documentNumber, password),
    );

    expect(result.role).toBe(Role.Provider);
  });

  it('returns Role.Customer when the Identity has a Pending Provider record (not yet approved)', async () => {
    const now = new Date();
    await providerRepository.save(
      new Provider(ProviderId.create(), {
        identityId,
        providerProfileId: ProfileId.create(),
        status: ProviderStatus.Pending,
        type: ProviderType.Independent,
        experience: ProviderExperience.Intermediate,
        biography: 'Plumber.',
        yearsOfExperience: 5,
        createdAt: now,
        updatedAt: now,
      }),
    );

    const result = await useCase.execute(
      new LoginCommand(documentNumber, password),
    );

    expect(result.role).toBe(Role.Customer);
  });

  it('persists a RefreshToken row on successful login', async () => {
    const result = await useCase.execute(
      new LoginCommand(documentNumber, password),
    );

    const stored = await refreshTokenRepository.findByTokenHash(
      tokenService.hashRefreshToken(result.refreshToken),
    );
    expect(stored).not.toBeNull();
    expect(stored?.isRevoked).toBe(false);
  });

  it('throws UnauthorizedException for an unknown documentNumber', async () => {
    await expect(
      useCase.execute(new LoginCommand('unknown-doc', password)),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException for an incorrect password', async () => {
    await expect(
      useCase.execute(new LoginCommand(documentNumber, 'wrong-password')),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when the Identity is not Active', async () => {
    const now = new Date();
    const inactiveDocumentNumber = 'inactive-doc';
    const inactiveIdentity = new Identity(IdentityId.create(), {
      fullName: 'Inactive Owner',
      documentType: DocumentType.NationalId,
      documentNumber: inactiveDocumentNumber,
      birthDate: now,
      status: IdentityStatus.Suspended,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(inactiveIdentity);

    await expect(
      useCase.execute(new LoginCommand(inactiveDocumentNumber, password)),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when there is no active Password Authentication method', async () => {
    const now = new Date();
    const noAuthDocumentNumber = 'no-auth-doc';
    const identity = new Identity(IdentityId.create(), {
      fullName: 'No Auth Owner',
      documentType: DocumentType.NationalId,
      documentNumber: noAuthDocumentNumber,
      birthDate: now,
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(identity);
    await credentialRepository.save(
      new Credential(CredentialId.create(), {
        identityId: identity.id,
        type: CredentialType.Password,
        status: CredentialStatus.Active,
        createdAt: now,
        updatedAt: now,
        passwordHash: await passwordHasher.hash(password),
      }),
    );
    // No Authentication row saved for this identity.

    await expect(
      useCase.execute(new LoginCommand(noAuthDocumentNumber, password)),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when there is no active Password credential', async () => {
    const now = new Date();
    const noCredDocumentNumber = 'no-cred-doc';
    const identity = new Identity(IdentityId.create(), {
      fullName: 'No Credential Owner',
      documentType: DocumentType.NationalId,
      documentNumber: noCredDocumentNumber,
      birthDate: now,
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(identity);
    await authenticationRepository.save(
      new Authentication(AuthenticationId.create(), {
        identityId: identity.id,
        methodType: AuthMethodType.Password,
        status: AuthenticationStatus.Active,
        createdAt: now,
        updatedAt: now,
      }),
    );
    // No Credential row saved for this identity.

    await expect(
      useCase.execute(new LoginCommand(noCredDocumentNumber, password)),
    ).rejects.toThrow(UnauthorizedException);
  });
});
