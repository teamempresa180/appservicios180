import { ChatController } from './chat.controller';
import { CreateChatUseCase } from '../../application/use_cases/create-chat.use-case';
import { CloseChatUseCase } from '../../application/use_cases/close-chat.use-case';
import { GetChatUseCase } from '../../application/use_cases/get-chat.use-case';
import { ListChatUseCase } from '../../application/use_cases/list-chat.use-case';
import { SearchChatUseCase } from '../../application/use_cases/search-chat.use-case';
import { CreateChatCommand } from '../../application/commands/create-chat.command';
import { CloseChatCommand } from '../../application/commands/close-chat.command';
import { GetChatQuery } from '../../application/queries/get-chat.query';
import { ListChatQuery } from '../../application/queries/list-chat.query';
import { SearchChatQuery } from '../../application/queries/search-chat.query';
import { ChatDto } from '../../application/dto/chat.dto';
import { ChatStatus } from '../../domain/value-objects/chat-status.value-object';
import { ChatType } from '../../domain/value-objects/chat-type.value-object';
import { CreateChatRequestDto } from '../dto/create-chat.request.dto';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';

describe('ChatController', () => {
  let controller: ChatController;
  let createUseCase: { execute: jest.Mock };
  let closeUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };

  const chatDto: ChatDto = {
    id: 'id-1',
    orderId: 'order-1',
    clientIdentityId: 'identity-1',
    providerId: 'provider-1',
    status: ChatStatus.Active,
    type: ChatType.OrderRelated,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(chatDto) };
    closeUseCase = { execute: jest.fn().mockResolvedValue(chatDto) };
    getUseCase = { execute: jest.fn().mockResolvedValue(chatDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [chatDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([chatDto]) };

    controller = new ChatController(
      createUseCase as unknown as CreateChatUseCase,
      closeUseCase as unknown as CloseChatUseCase,
      getUseCase as unknown as GetChatUseCase,
      listUseCase as unknown as ListChatUseCase,
      searchUseCase as unknown as SearchChatUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateChatRequestDto = {
      orderId: 'order-1',
      clientIdentityId: 'identity-1',
      providerId: 'provider-1',
      type: ChatType.OrderRelated,
    };

    const response = await controller.create(dto);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateChatCommand(
        'order-1',
        'identity-1',
        'provider-1',
        ChatType.OrderRelated,
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('close() delegates to CloseChatUseCase with the id', async () => {
    const response = await controller.close('id-1');

    expect(closeUseCase.execute).toHaveBeenCalledWith(
      new CloseChatCommand('id-1'),
    );
    expect(response.id).toBe('id-1');
  });

  it('list() maps page/pageSize query params to a query and wraps the paginated result', async () => {
    const response = await controller.list('2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(new ListChatQuery(2, 10));
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search('SUPPORT');

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchChatQuery('SUPPORT'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].type).toBe(ChatType.OrderRelated);
  });

  it('findOne() maps the Application DTO returned by GetChatUseCase', async () => {
    const response = await controller.findOne('id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(new GetChatQuery('id-1'));
    expect(response.id).toBe('id-1');
  });

  it('findOne() throws NotFoundException when GetChatUseCase returns null', async () => {
    getUseCase.execute.mockResolvedValue(null);

    await expect(controller.findOne('unknown-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
