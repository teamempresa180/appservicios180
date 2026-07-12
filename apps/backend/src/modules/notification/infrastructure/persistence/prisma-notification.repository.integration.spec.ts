import { PrismaClient } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationId } from '../../domain/value-objects/notification-id.value-object';
import { NotificationStatus } from '../../domain/value-objects/notification-status.value-object';
import { NotificationType } from '../../domain/value-objects/notification-type.value-object';
import { PrismaNotificationRepository } from './prisma-notification.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 */
describe('PrismaNotificationRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaNotificationRepository(prisma as never);
  let identityId: string;

  beforeAll(async () => {
    const identity = await prisma.identityModel.create({
      data: {
        id: `identity-for-notification-it-${Date.now()}`,
        fullName: 'Notification Integration Recipient',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-NOTIFICATION-${Date.now()}`,
        birthDate: new Date('1995-06-15'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    identityId = identity.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function buildNotification(overrides: Partial<{ title: string }> = {}) {
    return new Notification(NotificationId.create(), {
      identityId: IdentityId.fromString(identityId),
      title: overrides.title ?? 'Integration Test Notification',
      body: 'Provider accepted your order request.',
      type: NotificationType.Info,
      status: NotificationStatus.Unread,
      createdAt: new Date(),
      readAt: null,
    });
  }

  it('saves and finds a Notification by id', async () => {
    const notification = buildNotification();

    await repository.save(notification);
    const found = await repository.findById(notification.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(notification.id)).toBe(true);
    expect(found?.title).toBe(notification.title);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(NotificationId.create());
    expect(found).toBeNull();
  });

  it('finds Notifications by identityId', async () => {
    const notification = buildNotification();
    await repository.save(notification);

    const results = await repository.findByIdentityId(notification.identityId);

    expect(results.some((n) => n.id.equals(notification.id))).toBe(true);
  });

  it('deletes a Notification', async () => {
    const notification = buildNotification();
    await repository.save(notification);

    await repository.delete(notification.id);

    const found = await repository.findById(notification.id);
    expect(found).toBeNull();
  });

  it('lists Notifications with pagination', async () => {
    await repository.save(buildNotification());
    await repository.save(buildNotification());

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(1);
  });

  it('searches Notifications by title', async () => {
    const marker = `Searchable-${Date.now()}`;
    await repository.save(buildNotification({ title: marker }));

    const results = await repository.search(marker);

    expect(results.some((notification) => notification.title === marker)).toBe(
      true,
    );
  });
});
