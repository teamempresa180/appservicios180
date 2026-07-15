import { ApiProperty } from '@nestjs/swagger';
import { AvailabilityResponseDto } from './availability.response.dto';

/**
 * HTTP response body for `GET /availabilities` (paginated list).
 * Wraps `AvailabilityResponseDto[]` with the same pagination metadata
 * shape as `PaginatedResult<T>` (`core/application/paginated-result.ts`),
 * re-declared here purely for Swagger documentation of the HTTP
 * contract — the Application layer's `PaginatedResult<T>` is not a
 * DTO and is never referenced directly by the presentation layer.
 */
export class AvailabilityListResponseDto {
  @ApiProperty({ type: [AvailabilityResponseDto] })
  items!: AvailabilityResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  pageSize!: number;
}
