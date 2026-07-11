import { CredentialRepository } from '../../domain/interfaces/credential-repository.interface';
import { SearchCredentialQuery } from '../queries/search-credential.query';
import { CredentialDto } from '../dto/credential.dto';
import { CredentialMapper } from '../mappers/credential.mapper';

export class SearchCredentialUseCase {
  constructor(private readonly credentialRepository: CredentialRepository) {}

  async execute(query: SearchCredentialQuery): Promise<CredentialDto[]> {
    const results = await this.credentialRepository.search(query.term);
    return results.map((credential) => CredentialMapper.toDto(credential));
  }
}
