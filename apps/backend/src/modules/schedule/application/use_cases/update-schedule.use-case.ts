import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { Schedule } from '../../domain/entities/schedule.entity';
import { ScheduleRepository } from '../../domain/interfaces/schedule-repository.interface';
import { ScheduleId } from '../../domain/value-objects/schedule-id.value-object';
import { UpdateScheduleCommand } from '../commands/update-schedule.command';
import { ScheduleDto } from '../dto/schedule.dto';
import { ScheduleMapper } from '../mappers/schedule.mapper';
import { ScheduleValidator } from '../validators/schedule.validator';

/**
 * Updates the mutable fields of an existing Schedule block
 * (`startDateTime`, `endDateTime`, `status`) — `providerId`/`type`
 * are not offered by `UpdateScheduleCommand`, so they stay untouched.
 *
 * Authorization (Sprint 4, Etapa 18): the block's owning Provider is
 * resolved and its `identityId` compared against the caller, so only
 * that Identity — or an `Admin` — may edit the block.
 */
export class UpdateScheduleUseCase {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(
    command: UpdateScheduleCommand,
    caller: AuthenticatedUser,
  ): Promise<ScheduleDto> {
    ScheduleValidator.validateUpdate(command);

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
          'Only the Provider owning this Schedule block, or an Admin, may modify it',
        );
      }
    }

    const updated = new Schedule(existing.id, {
      providerId: existing.providerId,
      startDateTime: command.startDateTime ?? existing.startDateTime,
      endDateTime: command.endDateTime ?? existing.endDateTime,
      status: command.status ?? existing.status,
      type: existing.type,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.scheduleRepository.save(updated);
    return ScheduleMapper.toDto(updated);
  }
}
