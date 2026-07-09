import { AvailabilityRepository } from '../../domain/interfaces/availability-repository.interface';
import { AvailabilityDto } from '../dto/availability.dto';
import { GetAvailabilityQuery } from '../queries/get-availability.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetAvailabilityUseCase {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
  ) {}

  execute(query: GetAvailabilityQuery): Promise<AvailabilityDto | null> {
    void this.availabilityRepository;
    void query;
    throw new Error('Not implemented yet');
  }
}
