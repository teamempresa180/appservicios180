import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ScheduleRepository } from '../../domain/interfaces/schedule-repository.interface';
import { ScheduleId } from '../../domain/value-objects/schedule-id.value-object';
import { GetScheduleQuery } from '../queries/get-schedule.query';
import { ScheduleDto } from '../dto/schedule.dto';
import { ScheduleMapper } from '../mappers/schedule.mapper';

/**
 * Fetches a single Schedule block by id. Throws `NotFoundException`
 * instead of returning `null` — same pattern as `GetIdentityUseCase`.
 */
export class GetScheduleUseCase {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(query: GetScheduleQuery): Promise<ScheduleDto> {
    const schedule = await this.scheduleRepository.findById(
      ScheduleId.fromString(query.id),
    );
    if (!schedule) {
      throw new NotFoundException(`Schedule ${query.id} not found`);
    }
    return ScheduleMapper.toDto(schedule);
  }
}
