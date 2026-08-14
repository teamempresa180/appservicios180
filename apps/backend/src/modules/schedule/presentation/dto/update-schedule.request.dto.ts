import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ScheduleStatus } from '../../domain/value-objects/schedule-status.value-object';

/**
 * HTTP request body for `PUT /schedules/:id`. Distinct from
 * `application/dto/update-schedule.dto.ts` — see
 * `create-schedule.request.dto.ts` for the rationale.
 */
export class UpdateScheduleRequestDto {
  @ApiPropertyOptional({ example: '2026-01-01T08:30:00.000Z', type: String })
  @IsOptional()
  @IsDateString()
  startDateTime?: string;

  @ApiPropertyOptional({ example: '2026-01-01T09:30:00.000Z', type: String })
  @IsOptional()
  @IsDateString()
  endDateTime?: string;

  @ApiPropertyOptional({ enum: ScheduleStatus, example: ScheduleStatus.Open })
  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;
}
