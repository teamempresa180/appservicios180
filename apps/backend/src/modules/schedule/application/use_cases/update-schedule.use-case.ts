import { ScheduleRepository } from '../../domain/interfaces/schedule-repository.interface';
import { ScheduleDto } from '../dto/schedule.dto';
import { UpdateScheduleCommand } from '../commands/update-schedule.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class UpdateScheduleUseCase {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  execute(command: UpdateScheduleCommand): Promise<ScheduleDto> {
    void this.scheduleRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
