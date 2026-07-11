import { IdentityRepository } from '../../domain/interfaces/identity-repository.interface';
import { SearchIdentityQuery } from '../queries/search-identity.query';
import { IdentityDto } from '../dto/identity.dto';
import { IdentityMapper } from '../mappers/identity.mapper';

/** Free-text search over `fullName`/`documentNumber`. */
export class SearchIdentityUseCase {
  constructor(private readonly identityRepository: IdentityRepository) {}

  async execute(query: SearchIdentityQuery): Promise<IdentityDto[]> {
    const results = await this.identityRepository.search(query.term);
    return results.map((identity) => IdentityMapper.toDto(identity));
  }
}
