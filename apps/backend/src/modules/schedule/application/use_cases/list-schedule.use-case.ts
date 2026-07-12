import { PaginatedResult } from '../../../core/application/paginated-result';
import { ScheduleRepository } from '../../domain/interfaces/schedule-repository.interface';
import { ListScheduleQuery } from '../queries/list-schedule.query';
import { ScheduleDto } from '../dto/schedule.dto';
import { ScheduleMapper } from '../mappers/schedule.mapper';

/** Lists Schedule blocks page by page. */
export class ListScheduleUseCase {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(
    query: ListScheduleQuery,
  ): Promise<PaginatedResult<ScheduleDto>> {
    const result = await this.scheduleRepository.list(
      query.page,
      query.pageSize,
    );
    return {
      items: result.items.map((schedule) => ScheduleMapper.toDto(schedule)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
