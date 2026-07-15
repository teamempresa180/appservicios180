import { ApiProperty } from '@nestjs/swagger';
import { MessageResponseDto } from './message.response.dto';

/**
 * HTTP response body for `GET /messages` (paginated list). Wraps
 * `MessageResponseDto[]` with the same pagination metadata shape as
 * `PaginatedResult<T>` (`core/application/paginated-result.ts`),
 * re-declared here purely for Swagger documentation of the HTTP
 * contract.
 */
export class MessageListResponseDto {
  @ApiProperty({ type: [MessageResponseDto] })
  items!: MessageResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  pageSize!: number;
}
