import {
  Body,
  Controller,
  UseGuards,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../../common/swagger/error-response.dto';
import { JwtAuthGuard } from '../../../../common/auth/jwt-auth.guard';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { MessageRoutes } from '../routes/message.routes';
import { MessageSwagger } from '../swagger/message.swagger';
import { SendMessageUseCase } from '../../application/use_cases/send-message.use-case';
import { DeleteMessageUseCase } from '../../application/use_cases/delete-message.use-case';
import { GetMessageUseCase } from '../../application/use_cases/get-message.use-case';
import { ListMessageUseCase } from '../../application/use_cases/list-message.use-case';
import { SearchMessageUseCase } from '../../application/use_cases/search-message.use-case';
import { DeleteMessageCommand } from '../../application/commands/delete-message.command';
import { GetMessageQuery } from '../../application/queries/get-message.query';
import { ListMessageQuery } from '../../application/queries/list-message.query';
import { SearchMessageQuery } from '../../application/queries/search-message.query';
import { SendMessageRequestDto } from '../dto/send-message.request.dto';
import { MessageResponseDto } from '../dto/message.response.dto';
import { MessageListResponseDto } from '../dto/message-list.response.dto';
import { MessageHttpMapper } from '../dto/message-http.mapper';

/**
 * REST controller for Message. Only exposes routes, maps HTTP DTOs to
 * Application commands/queries via `MessageHttpMapper`, and delegates
 * to the corresponding Use Case — no business logic lives here.
 * `SendMessageUseCase` verifies the referenced Chat and sender
 * Identity both exist (two sequential `findById` calls, not a loop —
 * no N+1 risk).
 *
 * `GetMessageUseCase.execute()` returns `MessageDto | null` instead
 * of throwing `NotFoundException` (same pattern as `GetChatUseCase`/
 * `GetOrderUseCase`). This controller throws the shared
 * `NotFoundException` itself when the result is `null`, so
 * `DomainExceptionFilter` maps it to 404 exactly as it does
 * everywhere else — not business logic, just translating an existing
 * Application-layer "not found" signal.
 *
 * No Update endpoint (no `markAsRead`/`markAsDelivered` either):
 * there is no corresponding Use Case in the Application layer — only
 * Send/Delete/Get/List/Search exist.
 *
 * `search` is declared before the dynamic `findOne(:id)` route so
 * `GET /messages/search` resolves to `search()` rather than being
 * matched as `findOne({ id: 'search' })`.
 */
@ApiTags('Message')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller(MessageRoutes.base)
export class MessageController {
  constructor(
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly deleteMessageUseCase: DeleteMessageUseCase,
    private readonly getMessageUseCase: GetMessageUseCase,
    private readonly listMessageUseCase: ListMessageUseCase,
    private readonly searchMessageUseCase: SearchMessageUseCase,
  ) {}

  @Post()
  @ApiOperation(MessageSwagger.send)
  @ApiResponse({
    status: 201,
    description: 'Message sent.',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Chat or sender Identity not found.',
    type: ErrorResponseDto,
  })
  async send(@Body() dto: SendMessageRequestDto): Promise<MessageResponseDto> {
    const message = await this.sendMessageUseCase.execute(
      MessageHttpMapper.toSendCommand(dto),
    );
    return MessageHttpMapper.toResponse(message);
  }

  @Delete(MessageRoutes.byId)
  @ApiOperation(MessageSwagger.delete)
  @ApiParam({ name: 'id', description: 'Message id' })
  @ApiResponse({ status: 200, description: 'Message deleted.' })
  @ApiResponse({
    status: 404,
    description: 'Message not found.',
    type: ErrorResponseDto,
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteMessageUseCase.execute(new DeleteMessageCommand(id));
  }

  @Get()
  @ApiOperation(MessageSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of Messages.',
    type: MessageListResponseDto,
  })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<MessageListResponseDto> {
    const query = new ListMessageQuery(
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listMessageUseCase.execute(query);
    return MessageHttpMapper.toListResponse(result);
  }

  @Get(MessageRoutes.search)
  @ApiOperation(MessageSwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'faucet' })
  @ApiResponse({
    status: 200,
    description: 'Messages matching the search term.',
    type: [MessageResponseDto],
  })
  async search(@Query('term') term: string): Promise<MessageResponseDto[]> {
    const messages = await this.searchMessageUseCase.execute(
      new SearchMessageQuery(term),
    );
    return messages.map((message) => MessageHttpMapper.toResponse(message));
  }

  @Get(MessageRoutes.byId)
  @ApiOperation(MessageSwagger.get)
  @ApiParam({ name: 'id', description: 'Message id' })
  @ApiResponse({
    status: 200,
    description: 'Message found.',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<MessageResponseDto> {
    const message = await this.getMessageUseCase.execute(
      new GetMessageQuery(id),
    );
    if (!message) {
      throw new NotFoundException(`Message ${id} not found`);
    }
    return MessageHttpMapper.toResponse(message);
  }
}
