import { ApiProperty } from '@nestjs/swagger';
import { ReviewResponseDto } from './review.response.dto';

/**
 * HTTP response body for `GET /reviews` (paginated list). Wraps
 * `ReviewResponseDto[]` with the same pagination metadata shape as
 * `PaginatedResult<T>` (`core/application/paginated-result.ts`),
 * re-declared here purely for Swagger documentation of the HTTP
 * contract.
 */
export class ReviewListResponseDto {
  @ApiProperty({ type: [ReviewResponseDto] })
  items!: ReviewResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  pageSize!: number;
}
