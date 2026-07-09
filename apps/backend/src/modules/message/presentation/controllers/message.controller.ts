import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageRoutes } from '../routes/message.routes';
import { MessageSwagger } from '../swagger/message.swagger';
import { SendMessageUseCase } from '../../application/use_cases/send-message.use-case';
import { DeleteMessageUseCase } from '../../application/use_cases/delete-message.use-case';
import { GetMessageUseCase } from '../../application/use_cases/get-message.use-case';
import { SendMessageDto } from '../../application/dto/send-message.dto';
import { SendMessageCommand } from '../../application/commands/send-message.command';
import { DeleteMessageCommand } from '../../application/commands/delete-message.command';
import { GetMessageQuery } from '../../application/queries/get-message.query';

/**
 * REST controller for Message. Only exposes routes and delegates to the
 * corresponding Use Case — no business logic lives here. Use Cases are not
 * implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Message')
@Controller(MessageRoutes.base)
export class MessageController {
  constructor(
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly deleteMessageUseCase: DeleteMessageUseCase,
    private readonly getMessageUseCase: GetMessageUseCase,
  ) {}

  @Post()
  @ApiOperation(MessageSwagger.send)
  @ApiResponse({ status: 201, description: 'Message sent.' })
  send(@Body() dto: SendMessageDto) {
    return this.sendMessageUseCase.execute(
      new SendMessageCommand(
        dto.chatId,
        dto.senderIdentityId,
        dto.content,
        dto.type,
      ),
    );
  }

  @Delete(MessageRoutes.byId)
  @ApiOperation(MessageSwagger.delete)
  @ApiResponse({ status: 200, description: 'Message deleted.' })
  remove(@Param('id') id: string) {
    return this.deleteMessageUseCase.execute(new DeleteMessageCommand(id));
  }

  @Get(MessageRoutes.byId)
  @ApiOperation(MessageSwagger.get)
  @ApiResponse({ status: 200, description: 'Message found.' })
  findOne(@Param('id') id: string) {
    return this.getMessageUseCase.execute(new GetMessageQuery(id));
  }
}
