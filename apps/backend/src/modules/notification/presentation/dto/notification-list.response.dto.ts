import { ApiProperty } from '@nestjs/swagger';
import { NotificationResponseDto } from './notification.response.dto';

/**
 * HTTP response body for `GET /notifications` (paginated list). Wraps
 * `NotificationResponseDto[]` with the same pagination metadata shape
 * as `PaginatedResult<T>` (`core/application/paginated-result.ts`),
 * re-declared here purely for Swagger documentation of the HTTP
 * contract.
 */
export class NotificationListResponseDto {
  @ApiProperty({ type: [NotificationResponseDto] })
  items!: NotificationResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  pageSize!: number;
}
