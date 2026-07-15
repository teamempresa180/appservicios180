import { ApiProperty } from '@nestjs/swagger';
import { ScheduleStatus } from '../../domain/value-objects/schedule-status.value-object';
import { ScheduleType } from '../../domain/value-objects/schedule-type.value-object';

/**
 * HTTP response body for the Schedule endpoints. Distinct from
 * `application/dto/schedule.dto.ts` — see
 * `create-schedule.request.dto.ts` for the rationale.
 */
export class ScheduleResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  providerId!: string;

  @ApiProperty({ example: '2026-01-01T08:00:00.000Z', type: String })
  startDateTime!: string;

  @ApiProperty({ example: '2026-01-01T09:00:00.000Z', type: String })
  endDateTime!: string;

  @ApiProperty({ enum: ScheduleStatus })
  status!: ScheduleStatus;

  @ApiProperty({ enum: ScheduleType })
  type!: ScheduleType;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;
}
