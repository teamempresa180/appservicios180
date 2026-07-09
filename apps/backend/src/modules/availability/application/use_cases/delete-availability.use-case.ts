import { AvailabilityRepository } from '../../domain/interfaces/availability-repository.interface';
import { DeleteAvailabilityCommand } from '../commands/delete-availability.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class DeleteAvailabilityUseCase {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
  ) {}

  execute(command: DeleteAvailabilityCommand): Promise<void> {
    void this.availabilityRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
