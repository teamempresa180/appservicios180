import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { VerificationRepository } from '../../domain/interfaces/verification-repository.interface';
import { VerificationId } from '../../domain/value-objects/verification-id.value-object';
import { GetVerificationQuery } from '../queries/get-verification.query';
import { VerificationDto } from '../dto/verification.dto';
import { VerificationMapper } from '../mappers/verification.mapper';

/**
 * Fetches a single Verification by id. Throws `NotFoundException`
 * instead of returning `null` — same pattern as `GetIdentityUseCase`.
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
    return VerificationMapper.toDto(verification);
  }
}
