import { PaginatedResult } from '../../../core/application/paginated-result';
import { TrustRepository } from '../../domain/interfaces/trust-repository.interface';
import { ListTrustQuery } from '../queries/list-trust.query';
import { TrustDto } from '../dto/trust.dto';
import { TrustMapper } from '../mappers/trust.mapper';

/** Lists Trust records page by page. */
export class ListTrustUseCase {
  constructor(private readonly trustRepository: TrustRepository) {}

  async execute(query: ListTrustQuery): Promise<PaginatedResult<TrustDto>> {
    const result = await this.trustRepository.list(query.page, query.pageSize);
    return {
      items: result.items.map((trust) => TrustMapper.toDto(trust)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
