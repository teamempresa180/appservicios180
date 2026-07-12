import { ServiceRepository } from '../../domain/interfaces/service-repository.interface';
import { SearchServiceQuery } from '../queries/search-service.query';
import { ServiceDto } from '../dto/service.dto';
import { ServiceMapper } from '../mappers/service.mapper';

/**
 * Free-text search over `name`/`description`. Same criterion as
 * `SearchCategoryUseCase` — no separate `Search` domain module.
 */
export class SearchServiceUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async execute(query: SearchServiceQuery): Promise<ServiceDto[]> {
    const results = await this.serviceRepository.search(query.term);
    return results.map((service) => ServiceMapper.toDto(service));
  }
}
