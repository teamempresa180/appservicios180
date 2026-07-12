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
 */
export class CreateScheduleUseCase {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(command: CreateScheduleCommand): Promise<ScheduleDto> {
    ScheduleValidator.validateCreate(command);

    const providerId = ProviderId.fromString(command.providerId);
    const provider = await this.providerRepository.findById(providerId);
    if (!provider) {
      throw new NotFoundException(`Provider ${command.providerId} not found`);
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
