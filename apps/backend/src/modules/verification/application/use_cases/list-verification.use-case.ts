import { Role } from '../../../../common/auth/role.enum';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { VerificationRepository } from '../../domain/interfaces/verification-repository.interface';
import { ListVerificationQuery } from '../queries/list-verification.query';
import { VerificationDto } from '../dto/verification.dto';
import { VerificationMapper } from '../mappers/verification.mapper';

/**
 * Lists Verifications page by page, scoped to the caller's own
 * Identity. Unscoped, this handed every KYC record in the system —
 * who is verified, who was rejected, and the stored path of each
 * identity document — to any authenticated caller. Only an Admin gets
 * the full listing.
 */
export class ListVerificationUseCase {
  constructor(
    private readonly verificationRepository: VerificationRepository,
  ) {}

  async execute(
    query: ListVerificationQuery,
  ): Promise<PaginatedResult<VerificationDto>> {
    const scope =
      query.caller.role === Role.Admin
        ? null
        : IdentityId.fromString(query.caller.id);
    const result = await this.verificationRepository.list(
      query.page,
      query.pageSize,
      scope,
    );
    return {
      items: result.items.map((verification) =>
        VerificationMapper.toDto(verification),
      ),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
