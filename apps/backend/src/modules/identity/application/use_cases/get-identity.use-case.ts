import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { IdentityRepository } from '../../domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../domain/value-objects/identity-id.value-object';
import { GetIdentityQuery } from '../queries/get-identity.query';
import { IdentityDto } from '../dto/identity.dto';
import { IdentityMapper } from '../mappers/identity.mapper';

/**
 * Fetches a single Identity by id. Throws `NotFoundException` instead
 * of returning `null` — the caller (a future controller) maps that to
 * a 404 via `DomainExceptionFilter`, it doesn't have to check for
 * `null` itself.
 *
 * An Identity carries legal name plus document type/number, so only
 * its owner (or an `Admin`) may read it — see `UpdateIdentityUseCase`
 * for why the check precedes the lookup.
 */
export class GetIdentityUseCase {
  constructor(private readonly identityRepository: IdentityRepository) {}

  async execute(query: GetIdentityQuery): Promise<IdentityDto> {
    if (query.id !== query.callerId && query.callerRole !== Role.Admin) {
      throw new ForbiddenException('You may only read your own Identity');
    }

    const identity = await this.identityRepository.findById(
      IdentityId.fromString(query.id),
    );
    if (!identity) {
      throw new NotFoundException(`Identity ${query.id} not found`);
    }
    return IdentityMapper.toDto(identity);
  }
}
