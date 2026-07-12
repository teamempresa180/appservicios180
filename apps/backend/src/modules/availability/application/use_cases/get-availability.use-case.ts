import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { AvailabilityRepository } from '../../domain/interfaces/availability-repository.interface';
import { AvailabilityId } from '../../domain/value-objects/availability-id.value-object';
import { GetAvailabilityQuery } from '../queries/get-availability.query';
import { AvailabilityDto } from '../dto/availability.dto';
import { AvailabilityMapper } from '../mappers/availability.mapper';

/**
 * Fetches a single Availability by id. Throws `NotFoundException`
 * instead of returning `null` — same pattern as `GetIdentityUseCase`.
 */
export class GetAvailabilityUseCase {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
  ) {}

  async execute(query: GetAvailabilityQuery): Promise<AvailabilityDto> {
    const availability = await this.availabilityRepository.findById(
      AvailabilityId.fromString(query.id),
    );
    if (!availability) {
      throw new NotFoundException(`Availability ${query.id} not found`);
    }
    return AvailabilityMapper.toDto(availability);
  }
}
