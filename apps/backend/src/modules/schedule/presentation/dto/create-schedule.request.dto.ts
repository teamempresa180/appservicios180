import { ApiProperty } from '@nestjs/swagger';
import { ScheduleType } from '../../domain/value-objects/schedule-type.value-object';

/**
 * HTTP request body for `POST /schedules`. Distinct from
 * `application/dto/create-schedule.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `ScheduleHttpMapper` translates between the two.
 * `startDateTime`/`endDateTime` are ISO strings here, parsed to
 * `Date` in the mapper — malformed input still reaches
 * `ScheduleValidator.validateCreate`, which already rejects a
 * non-`Date`/invalid `Date`, so no validation logic is duplicated.
 */
export class CreateScheduleRequestDto {
  @ApiProperty({
    example: 'provider-id-123',
    description: 'The id of the Provider this Schedule block belongs to.',
  })
  providerId!: string;

  @ApiProperty({ example: '2026-01-01T08:00:00.000Z', type: String })
  startDateTime!: string;

  @ApiProperty({ example: '2026-01-01T09:00:00.000Z', type: String })
  endDateTime!: string;

  @ApiProperty({ enum: ScheduleType, example: ScheduleType.Regular })
  type!: ScheduleType;
}
