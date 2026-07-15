import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { NotificationPresentationModule } from '../src/modules/notification/presentation/notification.module';
import { NOTIFICATION_REPOSITORY } from '../src/modules/notification/domain/interfaces/notification-repository.interface';
import { InMemoryNotificationRepository } from '../src/modules/notification/application/use_cases/test-support/in-memory-notification.repository';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { Identity } from '../src/modules/identity/domain/entities/identity.entity';
import { IdentityId } from '../src/modules/identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../src/modules/identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../src/modules/identity/domain/value-objects/identity-status.value-object';
import { NotificationType } from '../src/modules/notification/domain/value-objects/notification-type.value-object';
import { NotificationResponseDto } from '../src/modules/notification/presentation/dto/notification.response.dto';
import { NotificationListResponseDto } from '../src/modules/notification/presentation/dto/notification-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Notification controller.
 * `NOTIFICATION_REPOSITORY` and `IDENTITY_REPOSITORY` (imported
 * directly by `NotificationPresentationModule`) are overridden with
 * in-memory fakes, pre-seeding one Identity — no other module is
 * transitively imported.
 */
describe('NotificationController (e2e)', () => {
  let app: INestApplication<App>;
  let identityId: string;

  beforeEach(async () => {
    const now = new Date();

    const identityRepository = new InMemoryIdentityRepository();
    const identity = new Identity(IdentityId.create(), {
      fullName: 'Recipient',
      documentType: DocumentType.NationalId,
      documentNumber: '123456789',
      birthDate: now,
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(identity);
    identityId = identity.id.value;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [NotificationPresentationModule],
    })
      .overrideProvider(NOTIFICATION_REPOSITORY)
      .useValue(new InMemoryNotificationRepository())
      .overrideProvider(IDENTITY_REPOSITORY)
      .useValue(identityRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(
      new AllExceptionsFilter(),
      new DomainExceptionFilter(),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const createNotificationBody = (
    overrides: Partial<Record<string, unknown>> = {},
  ) => ({
    identityId,
    title: 'Your order was accepted',
    body: 'Provider Jane Doe accepted your service request.',
    type: NotificationType.Info,
    ...overrides,
  });

  it('POST /notifications creates a Notification and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/notifications')
      .send(createNotificationBody())
      .expect(201);

    const body = response.body as NotificationResponseDto;
    expect(body.identityId).toBe(identityId);
    expect(body.status).toBe('UNREAD');
    expect(body.readAt).toBeNull();
  });

  it('POST /notifications returns 404 when the Identity does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/notifications')
      .send(createNotificationBody({ identityId: 'unknown-identity' }))
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('GET /notifications/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/notifications/unknown-id')
      .expect(404);
  });

  it('PUT /notifications/:id/read marks an existing Notification as read', async () => {
    const created = await request(app.getHttpServer())
      .post('/notifications')
      .send(createNotificationBody());
    const createdId = (created.body as NotificationResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/notifications/${createdId}/read`)
      .expect(200);

    const body = response.body as NotificationResponseDto;
    expect(body.status).toBe('READ');
    expect(body.readAt).not.toBeNull();
  });

  it('DELETE /notifications/:id deletes an existing Notification', async () => {
    const created = await request(app.getHttpServer())
      .post('/notifications')
      .send(createNotificationBody());
    const createdId = (created.body as NotificationResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/notifications/${createdId}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/notifications/${createdId}`)
      .expect(404);
  });

  it('GET /notifications lists Notifications page by page', async () => {
    await request(app.getHttpServer())
      .post('/notifications')
      .send(createNotificationBody());

    const response = await request(app.getHttpServer())
      .get('/notifications')
      .expect(200);

    const body = response.body as NotificationListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /notifications/search searches by title/body', async () => {
    await request(app.getHttpServer())
      .post('/notifications')
      .send(createNotificationBody());

    const response = await request(app.getHttpServer())
      .get('/notifications/search')
      .query({ term: 'order' })
      .expect(200);

    const body = response.body as NotificationResponseDto[];
    expect(body).toHaveLength(1);
    expect(body[0].title).toBe('Your order was accepted');
  });
});
