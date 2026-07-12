import { AvailabilityRepository } from '../../domain/interfaces/availability-repository.interface';
import { SearchAvailabilityQuery } from '../queries/search-availability.query';
import { AvailabilityDto } from '../dto/availability.dto';
import { AvailabilityMapper } from '../mappers/availability.mapper';

/** Free-text search over `type`/`status`. */
export class SearchAvailabilityUseCase {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
  ) {}

  async execute(query: SearchAvailabilityQuery): Promise<AvailabilityDto[]> {
    const results = await this.availabilityRepository.search(query.term);
    return results.map((availability) =>
      AvailabilityMapper.toDto(availability),
    );
  }
}
