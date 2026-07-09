import { AvailabilityRepository } from '../../domain/interfaces/availability-repository.interface';
import { AvailabilityDto } from '../dto/availability.dto';
import { UpdateAvailabilityCommand } from '../commands/update-availability.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class UpdateAvailabilityUseCase {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
  ) {}

  execute(command: UpdateAvailabilityCommand): Promise<AvailabilityDto> {
    void this.availabilityRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
