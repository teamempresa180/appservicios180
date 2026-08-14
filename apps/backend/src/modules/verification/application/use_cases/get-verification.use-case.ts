import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { VerificationRepository } from '../../domain/interfaces/verification-repository.interface';
import { VerificationId } from '../../domain/value-objects/verification-id.value-object';
import { GetVerificationQuery } from '../queries/get-verification.query';
import { VerificationDto } from '../dto/verification.dto';
import { VerificationMapper } from '../mappers/verification.mapper';

/**
 * Fetches a single Verification by id. Throws `NotFoundException`
 * instead of returning `null` — same pattern as `GetIdentityUseCase`.
 *
 * A Verification is KYC data (its status and the path to the identity
 * document backing it), so it is only returned to the Identity it
 * belongs to, or to an Admin.
 */
export class GetVerificationUseCase {
  constructor(
    private readonly verificationRepository: VerificationRepository,
  ) {}

  async execute(query: GetVerificationQuery): Promise<VerificationDto> {
    const verification = await this.verificationRepository.findById(
      VerificationId.fromString(query.id),
    );
    if (!verification) {
      throw new NotFoundException(`Verification ${query.id} not found`);
    }
    if (
      query.caller.role !== Role.Admin &&
      verification.identityId.value !== query.caller.id
    ) {
      throw new ForbiddenException(
        `Verification ${query.id} does not belong to the authenticated Identity`,
      );
    }
    return VerificationMapper.toDto(verification);
  }
}
