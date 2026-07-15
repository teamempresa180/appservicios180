import { ApiProperty } from '@nestjs/swagger';
import { ChatResponseDto } from './chat.response.dto';

/**
 * HTTP response body for `GET /chats` (paginated list). Wraps
 * `ChatResponseDto[]` with the same pagination metadata shape as
 * `PaginatedResult<T>` (`core/application/paginated-result.ts`),
 * re-declared here purely for Swagger documentation of the HTTP
 * contract.
 */
export class ChatListResponseDto {
  @ApiProperty({ type: [ChatResponseDto] })
  items!: ChatResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  pageSize!: number;
}
