import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ProviderRepository } from '../../domain/interfaces/provider-repository.interface';
import { ProviderId } from '../../domain/value-objects/provider-id.value-object';
import { DeleteProviderCommand } from '../commands/delete-provider.command';

/**
 * Deletes an existing Provider. No cascade rule is documented for
 * what happens to `Service`/`Availability`/`Schedule` records
 * referencing this `ProviderId` — same criterion as every other
 * `Delete*UseCase`.
 *
 * Authorization (Sprint 4, Etapa 18): restricted to the owning
 * Identity or an `Admin` — deleting another provider's record was
 * previously open to any authenticated caller.
 */
export class DeleteProviderUseCase {
  constructor(private readonly providerRepository: ProviderRepository) {}

  async execute(
    command: DeleteProviderCommand,
    caller: AuthenticatedUser,
  ): Promise<void> {
    const id = ProviderId.fromString(command.id);
    const existing = await this.providerRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Provider ${command.id} not found`);
    }
    if (
      caller.role !== Role.Admin &&
      existing.identityId.value !== caller.id
    ) {
      throw new ForbiddenException(
        'Only the owning Identity or an Admin may delete this Provider',
      );
    }
    await this.providerRepository.delete(id);
  }
}
