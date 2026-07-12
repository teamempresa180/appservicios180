import { ScheduleRepository } from '../../domain/interfaces/schedule-repository.interface';
import { SearchScheduleQuery } from '../queries/search-schedule.query';
import { ScheduleDto } from '../dto/schedule.dto';
import { ScheduleMapper } from '../mappers/schedule.mapper';

/** Free-text search over `type`/`status`. */
export class SearchScheduleUseCase {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(query: SearchScheduleQuery): Promise<ScheduleDto[]> {
    const results = await this.scheduleRepository.search(query.term);
    return results.map((schedule) => ScheduleMapper.toDto(schedule));
  }
}
