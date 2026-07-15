import { ApiPropertyOptional } from '@nestjs/swagger';
import { ScheduleStatus } from '../../domain/value-objects/schedule-status.value-object';

/**
 * HTTP request body for `PUT /schedules/:id`. Distinct from
 * `application/dto/update-schedule.dto.ts` — see
 * `create-schedule.request.dto.ts` for the rationale.
 */
export class UpdateScheduleRequestDto {
  @ApiPropertyOptional({ example: '2026-01-01T08:30:00.000Z', type: String })
  startDateTime?: string;

  @ApiPropertyOptional({ example: '2026-01-01T09:30:00.000Z', type: String })
  endDateTime?: string;

  @ApiPropertyOptional({ enum: ScheduleStatus, example: ScheduleStatus.Open })
  status?: ScheduleStatus;
}
