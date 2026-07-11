import { AuthenticationRepository } from '../../domain/interfaces/authentication-repository.interface';
import { SearchAuthenticationQuery } from '../queries/search-authentication.query';
import { AuthenticationDto } from '../dto/authentication.dto';
import { AuthenticationMapper } from '../mappers/authentication.mapper';

export class SearchAuthenticationUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  async execute(
    query: SearchAuthenticationQuery,
  ): Promise<AuthenticationDto[]> {
    const results = await this.authenticationRepository.search(query.term);
    return results.map((authentication) =>
      AuthenticationMapper.toDto(authentication),
    );
  }
}
