import { PaginatedResult } from '../../../core/application/paginated-result';
import { AuthenticationRepository } from '../../domain/interfaces/authentication-repository.interface';
import { ListAuthenticationQuery } from '../queries/list-authentication.query';
import { AuthenticationDto } from '../dto/authentication.dto';
import { AuthenticationMapper } from '../mappers/authentication.mapper';

export class ListAuthenticationUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  async execute(
    query: ListAuthenticationQuery,
  ): Promise<PaginatedResult<AuthenticationDto>> {
    const result = await this.authenticationRepository.list(
      query.page,
      query.pageSize,
    );
    return {
      items: result.items.map((authentication) =>
        AuthenticationMapper.toDto(authentication),
      ),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
