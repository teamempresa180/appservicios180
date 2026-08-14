import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { ServiceRepository } from '../../domain/interfaces/service-repository.interface';
import { ServiceId } from '../../domain/value-objects/service-id.value-object';
import { DeleteServiceCommand } from '../commands/delete-service.command';

/**
 * Deletes an existing Service. No cascade rule is documented for what
 * happens to other data referencing this `ServiceId` (e.g. future
 * `Order`/`Quote` records) — not implemented here, same criterion as
 * every other `Delete*UseCase`.
 *
 * Authorization (Sprint 4, Etapa 18): the Service's owning Provider is
 * resolved and its `identityId` compared against the caller, so only
 * that Identity — or an `Admin` — may delete the Service. Deleting a
 * competitor's listing was previously open to any authenticated
 * caller.
 */
export class DeleteServiceUseCase {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(
    command: DeleteServiceCommand,
    caller: AuthenticatedUser,
  ): Promise<void> {
    const id = ServiceId.fromString(command.id);
    const existing = await this.serviceRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Service ${command.id} not found`);
    }

    if (caller.role !== Role.Admin) {
      const provider = await this.providerRepository.findById(
        existing.providerId,
      );
      if (!provider || provider.identityId.value !== caller.id) {
        throw new ForbiddenException(
          'Only the Provider owning this Service, or an Admin, may delete it',
        );
      }
    }

    await this.serviceRepository.delete(id);
  }
}
