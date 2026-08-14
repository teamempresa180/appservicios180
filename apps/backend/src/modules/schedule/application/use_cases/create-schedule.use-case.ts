import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Schedule } from '../../domain/entities/schedule.entity';
import { ScheduleRepository } from '../../domain/interfaces/schedule-repository.interface';
import { ScheduleId } from '../../domain/value-objects/schedule-id.value-object';
import { ScheduleStatus } from '../../domain/value-objects/schedule-status.value-object';
import { CreateScheduleCommand } from '../commands/create-schedule.command';
import { ScheduleDto } from '../dto/schedule.dto';
import { ScheduleMapper } from '../mappers/schedule.mapper';
import { ScheduleValidator } from '../validators/schedule.validator';

/**
 * Creates a new Schedule block for an existing Provider, always in
 * `Open` status (nothing in the domain documents another starting
 * state). Depends on `ProviderRepository` (not just its own) to
 * verify the referenced Provider actually exists before creating a
 * block for it — same real-from-the-start check as
 * `CreateAvailabilityUseCase`.
 *
 * Authorization (Sprint 4, Etapa 18): the resolved Provider must be
 * owned by the authenticated caller unless the caller is an `Admin`,
 * so nobody can write blocks into another provider's calendar.
 */
export class CreateScheduleUseCase {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(
    command: CreateScheduleCommand,
    caller: AuthenticatedUser,
  ): Promise<ScheduleDto> {
    ScheduleValidator.validateCreate(command);

    const providerId = ProviderId.fromString(command.providerId);
    const provider = await this.providerRepository.findById(providerId);
    if (!provider) {
      throw new NotFoundException(`Provider ${command.providerId} not found`);
    }

    if (caller.role !== Role.Admin && provider.identityId.value !== caller.id) {
      throw new ForbiddenException(
        'A Schedule block can only be created for a Provider owned by the authenticated Identity',
      );
    }

    const now = new Date();
    const schedule = new Schedule(ScheduleId.create(), {
      providerId,
      startDateTime: command.startDateTime,
      endDateTime: command.endDateTime,
      status: ScheduleStatus.Open,
      type: command.type,
      createdAt: now,
      updatedAt: now,
    });

    await this.scheduleRepository.save(schedule);
    return ScheduleMapper.toDto(schedule);
  }
}
