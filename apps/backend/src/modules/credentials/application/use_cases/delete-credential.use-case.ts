import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { CredentialRepository } from '../../domain/interfaces/credential-repository.interface';
import { CredentialId } from '../../domain/value-objects/credential-id.value-object';
import { DeleteCredentialCommand } from '../commands/delete-credential.command';

export class DeleteCredentialUseCase {
  constructor(private readonly credentialRepository: CredentialRepository) {}

  async execute(command: DeleteCredentialCommand): Promise<void> {
    const id = CredentialId.fromString(command.id);
    const existing = await this.credentialRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Credential ${command.id} not found`);
    }
    await this.credentialRepository.delete(id);
  }
}
