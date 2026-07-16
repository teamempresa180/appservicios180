import { Role } from '../../../../common/auth/role.enum';
import { UnauthorizedException } from '../../../core/domain/exceptions/unauthorized.exception';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { CredentialRepository } from '../../../credentials/domain/interfaces/credential-repository.interface';
import { CredentialType } from '../../../credentials/domain/value-objects/credential-type.value-object';
import { CredentialStatus } from '../../../credentials/domain/value-objects/credential-status.value-object';
import { PasswordHasher } from '../../../credentials/application/ports/password-hasher.port';
import { AuthenticationRepository } from '../../domain/interfaces/authentication-repository.interface';
import { AuthMethodType } from '../../domain/value-objects/auth-method-type.value-object';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';
import { RefreshTokenRepository } from '../../domain/interfaces/refresh-token-repository.interface';
import { TokenService } from '../ports/token.port';
import { LoginCommand } from '../commands/login.command';
import { AuthTokensDto } from '../dto/auth-tokens.dto';
import { issueTokenPair } from '../services/issue-token-pair';

const INVALID_CREDENTIALS_MESSAGE = 'Invalid document number or password';

/**
 * Authenticates a documentNumber/password pair and issues a new
 * access/refresh token pair. Every failure path (unknown
 * documentNumber, inactive Identity, no active Password credential,
 * wrong password, no active Password Authentication method) throws
 * the exact same `UnauthorizedException` message — this is
 * deliberate: never let a caller distinguish "no such account" from
 * "wrong password", which would let an attacker enumerate valid
 * document numbers.
 *
 * Role derivation (Sprint 4, Etapa 7 decision): the domain has no
 * "role" field on `Identity`. The role is derived at login time by
 * checking whether a `Provider` record exists for the Identity —
 * `Role.Provider` if so, `Role.Customer` otherwise. This is a read,
 * not a new business rule.
 */
export class LoginUseCase {
  constructor(
    private readonly identityRepository: IdentityRepository,
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly credentialRepository: CredentialRepository,
    private readonly providerRepository: ProviderRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(command: LoginCommand): Promise<AuthTokensDto> {
    const identity = await this.identityRepository.findByDocumentNumber(
      command.documentNumber,
    );
    if (!identity || identity.status !== IdentityStatus.Active) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const authentications =
      await this.authenticationRepository.findByIdentityId(identity.id);
    const hasActivePasswordMethod = authentications.some(
      (auth) =>
        auth.methodType === AuthMethodType.Password &&
        auth.status === AuthenticationStatus.Active,
    );
    if (!hasActivePasswordMethod) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const credentials = await this.credentialRepository.findByIdentityId(
      identity.id,
    );
    const passwordCredential = credentials.find(
      (credential) =>
        credential.type === CredentialType.Password &&
        credential.status === CredentialStatus.Active &&
        credential.passwordHash,
    );
    if (!passwordCredential?.passwordHash) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const passwordMatches = await this.passwordHasher.verify(
      command.password,
      passwordCredential.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const provider = await this.providerRepository.findByIdentityId(
      identity.id,
    );
    const role = provider ? Role.Provider : Role.Customer;

    return issueTokenPair(
      this.tokenService,
      this.refreshTokenRepository,
      identity.id,
      role,
    );
  }
}
