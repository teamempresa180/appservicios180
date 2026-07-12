import { PaginatedResult } from '../../../core/application/paginated-result';
import { ServiceRepository } from '../../domain/interfaces/service-repository.interface';
import { ListServiceQuery } from '../queries/list-service.query';
import { ServiceDto } from '../dto/service.dto';
import { ServiceMapper } from '../mappers/service.mapper';

/** Lists Services page by page. */
export class ListServiceUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async execute(query: ListServiceQuery): Promise<PaginatedResult<ServiceDto>> {
    const result = await this.serviceRepository.list(
      query.page,
      query.pageSize,
    );
    return {
      items: result.items.map((service) => ServiceMapper.toDto(service)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
