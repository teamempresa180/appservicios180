import { ScheduleRepository } from '../../domain/interfaces/schedule-repository.interface';
import { ScheduleDto } from '../dto/schedule.dto';
import { GetScheduleQuery } from '../queries/get-schedule.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetScheduleUseCase {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  execute(query: GetScheduleQuery): Promise<ScheduleDto | null> {
    void this.scheduleRepository;
    void query;
    throw new Error('Not implemented yet');
  }
}
