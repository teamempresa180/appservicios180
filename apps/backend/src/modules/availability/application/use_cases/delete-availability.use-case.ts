import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { AvailabilityRepository } from '../../domain/interfaces/availability-repository.interface';
import { AvailabilityId } from '../../domain/value-objects/availability-id.value-object';
import { DeleteAvailabilityCommand } from '../commands/delete-availability.command';

/**
 * Deletes an existing Availability record. No cascade rule is
 * documented for what happens to other data referencing this
 * `AvailabilityId` — same criterion as every other `Delete*UseCase`.
 *
 * Authorization (Sprint 4, Etapa 18): the record's owning Provider is
 * resolved and its `identityId` compared against the caller, so only
 * that Identity — or an `Admin` — may delete the window.
 */
export class DeleteAvailabilityUseCase {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(
    command: DeleteAvailabilityCommand,
    caller: AuthenticatedUser,
  ): Promise<void> {
    const id = AvailabilityId.fromString(command.id);
    const existing = await this.availabilityRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Availability ${command.id} not found`);
    }

    if (caller.role !== Role.Admin) {
      const provider = await this.providerRepository.findById(
        existing.providerId,
      );
      if (!provider || provider.identityId.value !== caller.id) {
        throw new ForbiddenException(
          'Only the Provider owning this Availability, or an Admin, may delete it',
        );
      }
    }

    await this.availabilityRepository.delete(id);
  }
}
