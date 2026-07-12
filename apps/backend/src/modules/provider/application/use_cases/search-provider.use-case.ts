import { ProviderRepository } from '../../domain/interfaces/provider-repository.interface';
import { SearchProviderQuery } from '../queries/search-provider.query';
import { ProviderDto } from '../dto/provider.dto';
import { ProviderMapper } from '../mappers/provider.mapper';

/** Free-text search over `type`/`biography`. */
export class SearchProviderUseCase {
  constructor(private readonly providerRepository: ProviderRepository) {}

  async execute(query: SearchProviderQuery): Promise<ProviderDto[]> {
    const results = await this.providerRepository.search(query.term);
    return results.map((provider) => ProviderMapper.toDto(provider));
  }
}
