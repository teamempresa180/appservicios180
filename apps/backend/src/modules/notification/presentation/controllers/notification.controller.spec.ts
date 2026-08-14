import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { NotificationController } from './notification.controller';
import { CreateNotificationUseCase } from '../../application/use_cases/create-notification.use-case';
import { MarkNotificationAsReadUseCase } from '../../application/use_cases/mark-notification-as-read.use-case';
import { DeleteNotificationUseCase } from '../../application/use_cases/delete-notification.use-case';
import { GetNotificationUseCase } from '../../application/use_cases/get-notification.use-case';
import { ListNotificationUseCase } from '../../application/use_cases/list-notification.use-case';
import { SearchNotificationUseCase } from '../../application/use_cases/search-notification.use-case';
import { CreateNotificationCommand } from '../../application/commands/create-notification.command';
import { MarkNotificationAsReadCommand } from '../../application/commands/mark-notification-as-read.command';
import { DeleteNotificationCommand } from '../../application/commands/delete-notification.command';
import { GetNotificationQuery } from '../../application/queries/get-notification.query';
import { ListNotificationQuery } from '../../application/queries/list-notification.query';
import { SearchNotificationQuery } from '../../application/queries/search-notification.query';
import { NotificationDto } from '../../application/dto/notification.dto';
import { NotificationStatus } from '../../domain/value-objects/notification-status.value-object';
import { NotificationType } from '../../domain/value-objects/notification-type.value-object';
import { CreateNotificationRequestDto } from '../dto/create-notification.request.dto';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';

describe('NotificationController', () => {
  let controller: NotificationController;
  let createUseCase: { execute: jest.Mock };
  let markAsReadUseCase: { execute: jest.Mock };
  let deleteUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };

  const caller: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };

  const notificationDto: NotificationDto = {
    id: 'id-1',
    identityId: 'identity-1',
    title: 'Your order was accepted',
    body: 'Provider accepted your request.',
    type: NotificationType.Info,
    status: NotificationStatus.Unread,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    readAt: null,
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(notificationDto) };
    markAsReadUseCase = {
      execute: jest.fn().mockResolvedValue(notificationDto),
    };
    deleteUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
    getUseCase = { execute: jest.fn().mockResolvedValue(notificationDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [notificationDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([notificationDto]) };

    controller = new NotificationController(
      createUseCase as unknown as CreateNotificationUseCase,
      markAsReadUseCase as unknown as MarkNotificationAsReadUseCase,
      deleteUseCase as unknown as DeleteNotificationUseCase,
      getUseCase as unknown as GetNotificationUseCase,
      listUseCase as unknown as ListNotificationUseCase,
      searchUseCase as unknown as SearchNotificationUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateNotificationRequestDto = {
      identityId: 'identity-1',
      title: 'Your order was accepted',
      body: 'Provider accepted your request.',
      type: NotificationType.Info,
    };

    const response = await controller.create(caller, dto);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateNotificationCommand(
        caller,
        'identity-1',
        'Your order was accepted',
        'Provider accepted your request.',
        NotificationType.Info,
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('markAsRead() delegates to MarkNotificationAsReadUseCase with the id', async () => {
    const response = await controller.markAsRead(caller, 'id-1');

    expect(markAsReadUseCase.execute).toHaveBeenCalledWith(
      new MarkNotificationAsReadCommand(caller, 'id-1'),
    );
    expect(response.id).toBe('id-1');
  });

  it('remove() delegates to DeleteNotificationUseCase with the id', async () => {
    await controller.remove(caller, 'id-1');

    expect(deleteUseCase.execute).toHaveBeenCalledWith(
      new DeleteNotificationCommand(caller, 'id-1'),
    );
  });

  it('list() maps page/pageSize query params to a query and wraps the paginated result', async () => {
    const response = await controller.list(caller, '2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(
      new ListNotificationQuery(caller, 2, 10),
    );
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search(caller, 'order');

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchNotificationQuery(caller, 'order'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].title).toBe('Your order was accepted');
  });

  it('findOne() maps the Application DTO returned by GetNotificationUseCase', async () => {
    const response = await controller.findOne(caller, 'id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetNotificationQuery(caller, 'id-1'),
    );
    expect(response.title).toBe('Your order was accepted');
  });

  it('findOne() throws NotFoundException when GetNotificationUseCase returns null', async () => {
    getUseCase.execute.mockResolvedValue(null);

    await expect(controller.findOne(caller, 'unknown-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
