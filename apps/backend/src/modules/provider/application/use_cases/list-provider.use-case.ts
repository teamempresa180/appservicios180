import { PaginatedResult } from '../../../core/application/paginated-result';
import { ProviderRepository } from '../../domain/interfaces/provider-repository.interface';
import { ListProviderQuery } from '../queries/list-provider.query';
import { ProviderDto } from '../dto/provider.dto';
import { ProviderMapper } from '../mappers/provider.mapper';

/** Lists Providers page by page. */
export class ListProviderUseCase {
  constructor(private readonly providerRepository: ProviderRepository) {}

  async execute(
    query: ListProviderQuery,
  ): Promise<PaginatedResult<ProviderDto>> {
    const result = await this.providerRepository.list(
      query.page,
      query.pageSize,
    );
    return {
      items: result.items.map((provider) => ProviderMapper.toDto(provider)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
