import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatRoutes } from '../routes/chat.routes';
import { ChatSwagger } from '../swagger/chat.swagger';
import { CreateChatUseCase } from '../../application/use_cases/create-chat.use-case';
import { CloseChatUseCase } from '../../application/use_cases/close-chat.use-case';
import { GetChatUseCase } from '../../application/use_cases/get-chat.use-case';
import { CreateChatDto } from '../../application/dto/create-chat.dto';
import { CreateChatCommand } from '../../application/commands/create-chat.command';
import { CloseChatCommand } from '../../application/commands/close-chat.command';
import { GetChatQuery } from '../../application/queries/get-chat.query';

/**
 * REST controller for Chat. Only exposes routes and delegates to the
 * corresponding Use Case — no business logic lives here. Use Cases are not
 * implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Chat')
@Controller(ChatRoutes.base)
export class ChatController {
  constructor(
    private readonly createChatUseCase: CreateChatUseCase,
    private readonly closeChatUseCase: CloseChatUseCase,
    private readonly getChatUseCase: GetChatUseCase,
  ) {}

  @Post()
  @ApiOperation(ChatSwagger.create)
  @ApiResponse({ status: 201, description: 'Chat created.' })
  create(@Body() dto: CreateChatDto) {
    return this.createChatUseCase.execute(
      new CreateChatCommand(
        dto.orderId,
        dto.clientIdentityId,
        dto.providerId,
        dto.type,
      ),
    );
  }

  @Put(ChatRoutes.close)
  @ApiOperation(ChatSwagger.close)
  @ApiResponse({ status: 200, description: 'Chat closed.' })
  close(@Param('id') id: string) {
    return this.closeChatUseCase.execute(new CloseChatCommand(id));
  }

  @Get(ChatRoutes.byId)
  @ApiOperation(ChatSwagger.get)
  @ApiResponse({ status: 200, description: 'Chat found.' })
  findOne(@Param('id') id: string) {
    return this.getChatUseCase.execute(new GetChatQuery(id));
  }
}
