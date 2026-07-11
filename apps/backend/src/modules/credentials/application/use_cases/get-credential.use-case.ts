import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { CredentialRepository } from '../../domain/interfaces/credential-repository.interface';
import { CredentialId } from '../../domain/value-objects/credential-id.value-object';
import { GetCredentialQuery } from '../queries/get-credential.query';
import { CredentialDto } from '../dto/credential.dto';
import { CredentialMapper } from '../mappers/credential.mapper';

export class GetCredentialUseCase {
  constructor(private readonly credentialRepository: CredentialRepository) {}

  async execute(query: GetCredentialQuery): Promise<CredentialDto> {
    const credential = await this.credentialRepository.findById(
      CredentialId.fromString(query.id),
    );
    if (!credential) {
      throw new NotFoundException(`Credential ${query.id} not found`);
    }
    return CredentialMapper.toDto(credential);
  }
}
