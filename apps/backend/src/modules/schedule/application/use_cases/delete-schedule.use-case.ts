import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ScheduleRepository } from '../../domain/interfaces/schedule-repository.interface';
import { ScheduleId } from '../../domain/value-objects/schedule-id.value-object';
import { DeleteScheduleCommand } from '../commands/delete-schedule.command';

/**
 * Deletes an existing Schedule block. No cascade rule is documented
 * for what happens to other data referencing this `ScheduleId` — same
 * criterion as every other `Delete*UseCase`.
 */
export class DeleteScheduleUseCase {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(command: DeleteScheduleCommand): Promise<void> {
    const id = ScheduleId.fromString(command.id);
    const existing = await this.scheduleRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Schedule ${command.id} not found`);
    }
    await this.scheduleRepository.delete(id);
  }
}
