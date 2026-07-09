import { VerificationRepository } from '../../domain/interfaces/verification-repository.interface';
import { VerificationDto } from '../dto/verification.dto';
import { CreateVerificationCommand } from '../commands/create-verification.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CreateVerificationUseCase {
  constructor(
    private readonly verificationRepository: VerificationRepository,
  ) {}

  execute(command: CreateVerificationCommand): Promise<VerificationDto> {
    void this.verificationRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
