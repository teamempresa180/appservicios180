import { PaginatedResult } from '../../../core/application/paginated-result';
import { CredentialRepository } from '../../domain/interfaces/credential-repository.interface';
import { ListCredentialQuery } from '../queries/list-credential.query';
import { CredentialDto } from '../dto/credential.dto';
import { CredentialMapper } from '../mappers/credential.mapper';

export class ListCredentialUseCase {
  constructor(private readonly credentialRepository: CredentialRepository) {}

  async execute(
    query: ListCredentialQuery,
  ): Promise<PaginatedResult<CredentialDto>> {
    const result = await this.credentialRepository.list(
      query.page,
      query.pageSize,
    );
    return {
      items: result.items.map((credential) =>
        CredentialMapper.toDto(credential),
      ),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
