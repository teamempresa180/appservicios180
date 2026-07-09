import { VerificationRepository } from '../../domain/interfaces/verification-repository.interface';
import { VerificationDto } from '../dto/verification.dto';
import { GetVerificationQuery } from '../queries/get-verification.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetVerificationUseCase {
  constructor(
    private readonly verificationRepository: VerificationRepository,
  ) {}

  execute(query: GetVerificationQuery): Promise<VerificationDto | null> {
    void this.verificationRepository;
    void query;
    throw new Error('Not implemented yet');
  }
}
