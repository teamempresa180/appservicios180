import { MessageController } from './message.controller';
import { SendMessageUseCase } from '../../application/use_cases/send-message.use-case';
import { DeleteMessageUseCase } from '../../application/use_cases/delete-message.use-case';
import { GetMessageUseCase } from '../../application/use_cases/get-message.use-case';
import { ListMessageUseCase } from '../../application/use_cases/list-message.use-case';
import { SearchMessageUseCase } from '../../application/use_cases/search-message.use-case';
import { SendMessageCommand } from '../../application/commands/send-message.command';
import { DeleteMessageCommand } from '../../application/commands/delete-message.command';
import { GetMessageQuery } from '../../application/queries/get-message.query';
import { ListMessageQuery } from '../../application/queries/list-message.query';
import { SearchMessageQuery } from '../../application/queries/search-message.query';
import { MessageDto } from '../../application/dto/message.dto';
import { MessageStatus } from '../../domain/value-objects/message-status.value-object';
import { MessageType } from '../../domain/value-objects/message-type.value-object';
import { SendMessageRequestDto } from '../dto/send-message.request.dto';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';

describe('MessageController', () => {
  let controller: MessageController;
  let sendUseCase: { execute: jest.Mock };
  let deleteUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };

  const messageDto: MessageDto = {
    id: 'id-1',
    chatId: 'chat-1',
    senderIdentityId: 'identity-1',
    content: 'On my way.',
    type: MessageType.Text,
    status: MessageStatus.Sent,
    sentAt: new Date('2026-01-01T00:00:00.000Z'),
    readAt: null,
  };

  beforeEach(() => {
    sendUseCase = { execute: jest.fn().mockResolvedValue(messageDto) };
    deleteUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
    getUseCase = { execute: jest.fn().mockResolvedValue(messageDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [messageDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([messageDto]) };

    controller = new MessageController(
      sendUseCase as unknown as SendMessageUseCase,
      deleteUseCase as unknown as DeleteMessageUseCase,
      getUseCase as unknown as GetMessageUseCase,
      listUseCase as unknown as ListMessageUseCase,
      searchUseCase as unknown as SearchMessageUseCase,
    );
  });

  it('send() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: SendMessageRequestDto = {
      chatId: 'chat-1',
      senderIdentityId: 'identity-1',
      content: 'On my way.',
      type: MessageType.Text,
    };

    const response = await controller.send(dto);

    expect(sendUseCase.execute).toHaveBeenCalledWith(
      new SendMessageCommand(
        'chat-1',
        'identity-1',
        'On my way.',
        MessageType.Text,
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('remove() delegates to DeleteMessageUseCase with the id', async () => {
    await controller.remove('id-1');

    expect(deleteUseCase.execute).toHaveBeenCalledWith(
      new DeleteMessageCommand('id-1'),
    );
  });

  it('list() maps page/pageSize query params to a query and wraps the paginated result', async () => {
    const response = await controller.list('2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(
      new ListMessageQuery(2, 10),
    );
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search('faucet');

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchMessageQuery('faucet'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].content).toBe('On my way.');
  });

  it('findOne() maps the Application DTO returned by GetMessageUseCase', async () => {
    const response = await controller.findOne('id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetMessageQuery('id-1'),
    );
    expect(response.content).toBe('On my way.');
  });

  it('findOne() throws NotFoundException when GetMessageUseCase returns null', async () => {
    getUseCase.execute.mockResolvedValue(null);

    await expect(controller.findOne('unknown-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
