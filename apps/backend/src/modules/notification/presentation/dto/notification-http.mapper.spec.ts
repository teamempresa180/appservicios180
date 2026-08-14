import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { NotificationDto } from '../../application/dto/notification.dto';
import { NotificationStatus } from '../../domain/value-objects/notification-status.value-object';
import { NotificationType } from '../../domain/value-objects/notification-type.value-object';
import { CreateNotificationRequestDto } from './create-notification.request.dto';
import { NotificationHttpMapper } from './notification-http.mapper';

describe('NotificationHttpMapper', () => {
  const caller: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };

  it('toCreateCommand() maps every field in order', () => {
    const dto: CreateNotificationRequestDto = {
      identityId: 'identity-1',
      title: 'Your order was accepted',
      body: 'Provider accepted your request.',
      type: NotificationType.Info,
    };

    const command = NotificationHttpMapper.toCreateCommand(caller, dto);

    expect(command.identityId).toBe('identity-1');
    expect(command.title).toBe('Your order was accepted');
    expect(command.body).toBe('Provider accepted your request.');
    expect(command.type).toBe(NotificationType.Info);
  });

  it('toResponse() converts createdAt to an ISO string and readAt to null when absent', () => {
    const dto: NotificationDto = {
      id: 'id-1',
      identityId: 'identity-1',
      title: 'Your order was accepted',
      body: 'Provider accepted your request.',
      type: NotificationType.Info,
      status: NotificationStatus.Unread,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      readAt: null,
    };

    const response = NotificationHttpMapper.toResponse(dto);

    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.readAt).toBeNull();
  });

  it('toResponse() converts a present readAt to an ISO string', () => {
    const dto: NotificationDto = {
      id: 'id-1',
      identityId: 'identity-1',
      title: 'Your order was accepted',
      body: 'Provider accepted your request.',
      type: NotificationType.Info,
      status: NotificationStatus.Read,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      readAt: new Date('2026-01-01T01:00:00.000Z'),
    };

    const response = NotificationHttpMapper.toResponse(dto);

    expect(response.readAt).toBe('2026-01-01T01:00:00.000Z');
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: NotificationDto = {
      id: 'id-1',
      identityId: 'identity-1',
      title: 'Your order was accepted',
      body: 'Provider accepted your request.',
      type: NotificationType.Info,
      status: NotificationStatus.Unread,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      readAt: null,
    };

    const response = NotificationHttpMapper.toListResponse({
      items: [dto],
      total: 1,
      page: 1,
      pageSize: 20,
    });

    expect(response.items).toHaveLength(1);
    expect(response.items[0].id).toBe('id-1');
    expect(response.total).toBe(1);
  });
});
