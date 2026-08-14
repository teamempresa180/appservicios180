import { Role } from '../../../../common/auth/role.enum';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { VerificationRepository } from '../../domain/interfaces/verification-repository.interface';
import { SearchVerificationQuery } from '../queries/search-verification.query';
import { VerificationDto } from '../dto/verification.dto';
import { VerificationMapper } from '../mappers/verification.mapper';

/**
 * Free-text search over `type`/`status`, scoped to the caller's own
 * Identity. Unscoped, searching for `APPROVED` returned the KYC record
 * of every verified user in the system. Only an Admin searches
 * globally.
 */
export class SearchVerificationUseCase {
  constructor(
    private readonly verificationRepository: VerificationRepository,
  ) {}

  async execute(query: SearchVerificationQuery): Promise<VerificationDto[]> {
    const scope =
      query.caller.role === Role.Admin
        ? null
        : IdentityId.fromString(query.caller.id);
    const results = await this.verificationRepository.search(query.term, scope);
    return results.map((verification) =>
      VerificationMapper.toDto(verification),
    );
  }
}
