import { Schedule } from '../../domain/entities/schedule.entity';
import { ScheduleDto } from '../dto/schedule.dto';

/**
 * Translates between the Schedule domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class ScheduleMapper {
  static toDto(schedule: Schedule): ScheduleDto {
    const dto = new ScheduleDto();
    dto.id = schedule.id.value;
    dto.providerId = schedule.providerId.value;
    dto.startDateTime = schedule.startDateTime;
    dto.endDateTime = schedule.endDateTime;
    dto.status = schedule.status;
    dto.type = schedule.type;
    dto.createdAt = schedule.createdAt;
    dto.updatedAt = schedule.updatedAt;
    return dto;
  }
}
