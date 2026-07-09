import { ScheduleRepository } from '../../domain/interfaces/schedule-repository.interface';
import { DeleteScheduleCommand } from '../commands/delete-schedule.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class DeleteScheduleUseCase {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  execute(command: DeleteScheduleCommand): Promise<void> {
    void this.scheduleRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
