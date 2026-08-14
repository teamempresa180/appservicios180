import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
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
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  providerId!: string;

  @ApiProperty({ example: '2026-01-01T08:00:00.000Z', type: String })
  @IsDateString()
  startDateTime!: string;

  /** Ordering against `startDateTime` stays in `ScheduleValidator` — a cross-field rule the pipe cannot express. */
  @ApiProperty({ example: '2026-01-01T09:00:00.000Z', type: String })
  @IsDateString()
  endDateTime!: string;

  @ApiProperty({ enum: ScheduleType, example: ScheduleType.Regular })
  @IsEnum(ScheduleType)
  type!: ScheduleType;
}
