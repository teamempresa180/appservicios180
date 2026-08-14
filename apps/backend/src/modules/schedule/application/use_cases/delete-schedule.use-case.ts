import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { ScheduleRepository } from '../../domain/interfaces/schedule-repository.interface';
import { ScheduleId } from '../../domain/value-objects/schedule-id.value-object';
import { DeleteScheduleCommand } from '../commands/delete-schedule.command';

/**
 * Deletes an existing Schedule block. No cascade rule is documented
 * for what happens to other data referencing this `ScheduleId` — same
 * criterion as every other `Delete*UseCase`.
 *
 * Authorization (Sprint 4, Etapa 18): the block's owning Provider is
 * resolved and its `identityId` compared against the caller, so only
 * that Identity — or an `Admin` — may delete the block.
 */
export class DeleteScheduleUseCase {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(
    command: DeleteScheduleCommand,
    caller: AuthenticatedUser,
  ): Promise<void> {
    const id = ScheduleId.fromString(command.id);
    const existing = await this.scheduleRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Schedule ${command.id} not found`);
    }

    if (caller.role !== Role.Admin) {
      const provider = await this.providerRepository.findById(
        existing.providerId,
      );
      if (!provider || provider.identityId.value !== caller.id) {
        throw new ForbiddenException(
          'Only the Provider owning this Schedule block, or an Admin, may delete it',
        );
      }
    }

    await this.scheduleRepository.delete(id);
  }
}
