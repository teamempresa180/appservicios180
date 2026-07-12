import { TrustRepository } from '../../domain/interfaces/trust-repository.interface';
import { SearchTrustQuery } from '../queries/search-trust.query';
import { TrustDto } from '../dto/trust.dto';
import { TrustMapper } from '../mappers/trust.mapper';

/** Free-text search over `level`/`status`. */
export class SearchTrustUseCase {
  constructor(private readonly trustRepository: TrustRepository) {}

  async execute(query: SearchTrustQuery): Promise<TrustDto[]> {
    const results = await this.trustRepository.search(query.term);
    return results.map((trust) => TrustMapper.toDto(trust));
  }
}
