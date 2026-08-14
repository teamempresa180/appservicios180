import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { CredentialRepository } from '../../domain/interfaces/credential-repository.interface';
import { CredentialId } from '../../domain/value-objects/credential-id.value-object';
import { GetCredentialQuery } from '../queries/get-credential.query';
import { CredentialDto } from '../dto/credential.dto';
import { CredentialMapper } from '../mappers/credential.mapper';

/**
 * Fetches a single Credential record. Only the Identity it belongs to
 * (or an `Admin`) may read it — see `UpdateCredentialUseCase` for why
 * ownership is checked after the lookup rather than before it.
 * `CredentialMapper` never exposes `passwordHash`, but the record's
 * type/status still describe how a specific account authenticates.
 */
export class GetCredentialUseCase {
  constructor(private readonly credentialRepository: CredentialRepository) {}

  async execute(query: GetCredentialQuery): Promise<CredentialDto> {
    const credential = await this.credentialRepository.findById(
      CredentialId.fromString(query.id),
    );
    if (!credential) {
      throw new NotFoundException(`Credential ${query.id} not found`);
    }
    if (
      credential.identityId.value !== query.callerId &&
      query.callerRole !== Role.Admin
    ) {
      throw new ForbiddenException(
        'You may only read your own Credential records',
      );
    }
    return CredentialMapper.toDto(credential);
  }
}
