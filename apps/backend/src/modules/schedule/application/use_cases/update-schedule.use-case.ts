import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
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
 */
export class UpdateScheduleUseCase {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(command: UpdateScheduleCommand): Promise<ScheduleDto> {
    ScheduleValidator.validateUpdate(command);

    const id = ScheduleId.fromString(command.id);
    const existing = await this.scheduleRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Schedule ${command.id} not found`);
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
