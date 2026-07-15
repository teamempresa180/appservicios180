import { ApiProperty } from '@nestjs/swagger';
import { ScheduleResponseDto } from './schedule.response.dto';

/**
 * HTTP response body for `GET /schedules` (paginated list). Wraps
 * `ScheduleResponseDto[]` with the same pagination metadata shape as
 * `PaginatedResult<T>` (`core/application/paginated-result.ts`),
 * re-declared here purely for Swagger documentation of the HTTP
 * contract — the Application layer's `PaginatedResult<T>` is not a
 * DTO and is never referenced directly by the presentation layer.
 */
export class ScheduleListResponseDto {
  @ApiProperty({ type: [ScheduleResponseDto] })
  items!: ScheduleResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  pageSize!: number;
}
