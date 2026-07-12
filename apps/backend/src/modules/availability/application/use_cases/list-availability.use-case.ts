import { PaginatedResult } from '../../../core/application/paginated-result';
import { AvailabilityRepository } from '../../domain/interfaces/availability-repository.interface';
import { ListAvailabilityQuery } from '../queries/list-availability.query';
import { AvailabilityDto } from '../dto/availability.dto';
import { AvailabilityMapper } from '../mappers/availability.mapper';

/** Lists Availabilities page by page. */
export class ListAvailabilityUseCase {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
  ) {}

  async execute(
    query: ListAvailabilityQuery,
  ): Promise<PaginatedResult<AvailabilityDto>> {
    const result = await this.availabilityRepository.list(
      query.page,
      query.pageSize,
    );
    return {
      items: result.items.map((availability) =>
        AvailabilityMapper.toDto(availability),
      ),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
