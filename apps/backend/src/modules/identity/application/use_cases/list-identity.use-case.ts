import { PaginatedResult } from '../../../core/application/paginated-result';
import { IdentityRepository } from '../../domain/interfaces/identity-repository.interface';
import { ListIdentityQuery } from '../queries/list-identity.query';
import { IdentityDto } from '../dto/identity.dto';
import { IdentityMapper } from '../mappers/identity.mapper';

/** Lists Identities page by page. */
export class ListIdentityUseCase {
  constructor(private readonly identityRepository: IdentityRepository) {}

  async execute(
    query: ListIdentityQuery,
  ): Promise<PaginatedResult<IdentityDto>> {
    const result = await this.identityRepository.list(
      query.page,
      query.pageSize,
    );
    return {
      items: result.items.map((identity) => IdentityMapper.toDto(identity)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
