import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
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
import { ChatRoutes } from '../routes/chat.routes';
import { ChatSwagger } from '../swagger/chat.swagger';
import { CreateChatUseCase } from '../../application/use_cases/create-chat.use-case';
import { CloseChatUseCase } from '../../application/use_cases/close-chat.use-case';
import { GetChatUseCase } from '../../application/use_cases/get-chat.use-case';
import { ListChatUseCase } from '../../application/use_cases/list-chat.use-case';
import { SearchChatUseCase } from '../../application/use_cases/search-chat.use-case';
import { CloseChatCommand } from '../../application/commands/close-chat.command';
import { GetChatQuery } from '../../application/queries/get-chat.query';
import { ListChatQuery } from '../../application/queries/list-chat.query';
import { SearchChatQuery } from '../../application/queries/search-chat.query';
import { CreateChatRequestDto } from '../dto/create-chat.request.dto';
import { ChatResponseDto } from '../dto/chat.response.dto';
import { ChatListResponseDto } from '../dto/chat-list.response.dto';
import { ChatHttpMapper } from '../dto/chat-http.mapper';

/**
 * REST controller for Chat. Only exposes routes, maps HTTP DTOs to
 * Application commands/queries via `ChatHttpMapper`, and delegates
 * to the corresponding Use Case — no business logic lives here.
 * `CreateChatUseCase` verifies the referenced Order, client Identity
 * and Provider all exist (three sequential `findById` calls, not a
 * loop — no N+1 risk).
 *
 * `GetChatUseCase.execute()` returns `ChatDto | null` instead of
 * throwing `NotFoundException` (same pattern as `GetOrderUseCase`/
 * `GetPaymentUseCase`). This controller throws the shared
 * `NotFoundException` itself when the result is `null`, so
 * `DomainExceptionFilter` maps it to 404 exactly as it does
 * everywhere else — not business logic, just translating an existing
 * Application-layer "not found" signal.
 *
 * No Update/Delete endpoint: there is no `UpdateChatUseCase`/
 * `DeleteChatUseCase` in the Application layer — `close` is the only
 * supported status transition.
 *
 * `search` is declared before the dynamic `findOne(:id)` route so
 * `GET /chats/search` resolves to `search()` rather than being
 * matched as `findOne({ id: 'search' })`.
 */
@ApiTags('Chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller(ChatRoutes.base)
export class ChatController {
  constructor(
    private readonly createChatUseCase: CreateChatUseCase,
    private readonly closeChatUseCase: CloseChatUseCase,
    private readonly getChatUseCase: GetChatUseCase,
    private readonly listChatUseCase: ListChatUseCase,
    private readonly searchChatUseCase: SearchChatUseCase,
  ) {}

  @Post()
  @ApiOperation(ChatSwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Chat created.',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order, client Identity or Provider not found.',
    type: ErrorResponseDto,
  })
  async create(@Body() dto: CreateChatRequestDto): Promise<ChatResponseDto> {
    const chat = await this.createChatUseCase.execute(
      ChatHttpMapper.toCreateCommand(dto),
    );
    return ChatHttpMapper.toResponse(chat);
  }

  @Put(ChatRoutes.close)
  @ApiOperation(ChatSwagger.close)
  @ApiParam({ name: 'id', description: 'Chat id' })
  @ApiResponse({
    status: 200,
    description: 'Chat closed.',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found.',
    type: ErrorResponseDto,
  })
  async close(@Param('id') id: string): Promise<ChatResponseDto> {
    const chat = await this.closeChatUseCase.execute(new CloseChatCommand(id));
    return ChatHttpMapper.toResponse(chat);
  }

  @Get()
  @ApiOperation(ChatSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of Chats.',
    type: ChatListResponseDto,
  })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<ChatListResponseDto> {
    const query = new ListChatQuery(
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listChatUseCase.execute(query);
    return ChatHttpMapper.toListResponse(result);
  }

  @Get(ChatRoutes.search)
  @ApiOperation(ChatSwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'SUPPORT' })
  @ApiResponse({
    status: 200,
    description: 'Chats matching the search term.',
    type: [ChatResponseDto],
  })
  async search(@Query('term') term: string): Promise<ChatResponseDto[]> {
    const chats = await this.searchChatUseCase.execute(
      new SearchChatQuery(term),
    );
    return chats.map((chat) => ChatHttpMapper.toResponse(chat));
  }

  @Get(ChatRoutes.byId)
  @ApiOperation(ChatSwagger.get)
  @ApiParam({ name: 'id', description: 'Chat id' })
  @ApiResponse({
    status: 200,
    description: 'Chat found.',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<ChatResponseDto> {
    const chat = await this.getChatUseCase.execute(new GetChatQuery(id));
    if (!chat) {
      throw new NotFoundException(`Chat ${id} not found`);
    }
    return ChatHttpMapper.toResponse(chat);
  }
}
