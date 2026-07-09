import { ScheduleRepository } from '../../domain/interfaces/schedule-repository.interface';
import { ScheduleDto } from '../dto/schedule.dto';
import { CreateScheduleCommand } from '../commands/create-schedule.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CreateScheduleUseCase {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  execute(command: CreateScheduleCommand): Promise<ScheduleDto> {
    void this.scheduleRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
