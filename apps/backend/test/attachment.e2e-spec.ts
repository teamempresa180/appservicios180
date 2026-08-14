import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import request from 'supertest';
import { App } from 'supertest/types';
import { AttachmentPresentationModule } from '../src/modules/attachment/presentation/attachment.module';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { JwtStrategy } from '../src/common/auth/jwt.strategy';
import { signTestAccessToken } from './support/sign-test-token';
import { ATTACHMENT_REPOSITORY } from '../src/modules/attachment/domain/interfaces/attachment-repository.interface';
import { InMemoryAttachmentRepository } from '../src/modules/attachment/application/use_cases/test-support/in-memory-attachment.repository';
import { MESSAGE_REPOSITORY } from '../src/modules/message/domain/interfaces/message-repository.interface';
import { InMemoryMessageRepository } from '../src/modules/message/application/use_cases/test-support/in-memory-message.repository';
import { Message } from '../src/modules/message/domain/entities/message.entity';
import { MessageId } from '../src/modules/message/domain/value-objects/message-id.value-object';
import { MessageStatus } from '../src/modules/message/domain/value-objects/message-status.value-object';
import { MessageType } from '../src/modules/message/domain/value-objects/message-type.value-object';
import { ChatId } from '../src/modules/chat/domain/value-objects/chat-id.value-object';
import { CHAT_REPOSITORY } from '../src/modules/chat/domain/interfaces/chat-repository.interface';
import { InMemoryChatRepository } from '../src/modules/chat/application/use_cases/test-support/in-memory-chat.repository';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { IdentityId } from '../src/modules/identity/domain/value-objects/identity-id.value-object';
import { ORDER_REPOSITORY } from '../src/modules/order/domain/interfaces/order-repository.interface';
import { InMemoryOrderRepository } from '../src/modules/order/application/use_cases/test-support/in-memory-order.repository';
import { PROVIDER_REPOSITORY } from '../src/modules/provider/domain/interfaces/provider-repository.interface';
import { InMemoryProviderRepository } from '../src/modules/provider/application/use_cases/test-support/in-memory-provider.repository';
import { PROFILE_REPOSITORY } from '../src/modules/profiles/domain/interfaces/profile-repository.interface';
import { InMemoryProfileRepository } from '../src/modules/profiles/application/use_cases/test-support/in-memory-profile.repository';
import { CATEGORY_REPOSITORY } from '../src/modules/category/domain/interfaces/category-repository.interface';
import { InMemoryCategoryRepository } from '../src/modules/category/application/use_cases/test-support/in-memory-category.repository';
import { CATEGORY_SPECIALIZATION_REPOSITORY } from '../src/modules/category/domain/interfaces/category-specialization-repository.interface';
import { InMemoryCategorySpecializationRepository } from '../src/modules/category/application/use_cases/test-support/in-memory-category-specialization.repository';
import { SERVICE_REPOSITORY } from '../src/modules/service/domain/interfaces/service-repository.interface';
import { InMemoryServiceRepository } from '../src/modules/service/application/use_cases/test-support/in-memory-service.repository';
import { AttachmentType } from '../src/modules/attachment/domain/value-objects/attachment-type.value-object';
import { AttachmentResponseDto } from '../src/modules/attachment/presentation/dto/attachment.response.dto';
import { AttachmentListResponseDto } from '../src/modules/attachment/presentation/dto/attachment-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Attachment controller — same
 * reasoning as `message.e2e-spec.ts`. `ATTACHMENT_REPOSITORY` and
 * `MESSAGE_REPOSITORY` (imported transitively via
 * `AttachmentPresentationModule`) are overridden with in-memory
 * fakes, pre-seeding one Message. `CHAT_REPOSITORY`/
 * `IDENTITY_REPOSITORY`/`ORDER_REPOSITORY`/`PROVIDER_REPOSITORY`/
 * `PROFILE_REPOSITORY`/`CATEGORY_REPOSITORY`/`SERVICE_REPOSITORY` are
 * also overridden because `MessagePresentationModule` (imported
 * transitively) pulls in `ChatPresentationModule`, which itself pulls
 * in `OrderPresentationModule`/`ProviderPresentationModule`.
 *
 * `CATEGORY_SPECIALIZATION_REPOSITORY` is overridden for the same
 * reason as the rest: every Prisma-backed repository reachable from
 * this graph needs a fake, because `PrismaService` lives in a
 * `@Global` module that only `AppModule` imports — a TestingModule
 * built from the feature module alone cannot resolve it.
 */
describe('AttachmentController (e2e)', () => {
  let app: INestApplication<App>;
  let messageId: string;
  /** The Message's sender — may attach to it and delete its files. */
  let authHeader: string;
  /** The other side of the Chat — sees the files, cannot mutate them. */
  let peerAuthHeader: string;
  /** An Identity outside the Chat entirely. */
  let strangerAuthHeader: string;

  beforeEach(async () => {
    const now = new Date();

    const senderIdentityId = IdentityId.create();
    const peerIdentityId = IdentityId.create();

    const messageRepository = new InMemoryMessageRepository();
    const message = new Message(MessageId.create(), {
      chatId: ChatId.create(),
      senderIdentityId,
      content: 'On my way, be there in 10 minutes.',
      type: MessageType.Text,
      status: MessageStatus.Sent,
      sentAt: now,
      readAt: null,
    });
    await messageRepository.save(message);
    messageId = message.id.value;

    // The in-memory Attachment fake has no Chat graph to walk, so the
    // Message's audience is declared directly — see
    // `InMemoryAttachmentRepository.registerParticipants`.
    const attachmentRepository = new InMemoryAttachmentRepository();
    attachmentRepository.registerParticipants(messageId, [
      senderIdentityId.value,
      peerIdentityId.value,
    ]);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        AttachmentPresentationModule,
      ],
      providers: [JwtStrategy],
    })
      .overrideProvider(ATTACHMENT_REPOSITORY)
      .useValue(attachmentRepository)
      .overrideProvider(MESSAGE_REPOSITORY)
      .useValue(messageRepository)
      .overrideProvider(CHAT_REPOSITORY)
      .useValue(new InMemoryChatRepository())
      .overrideProvider(IDENTITY_REPOSITORY)
      .useValue(new InMemoryIdentityRepository())
      .overrideProvider(ORDER_REPOSITORY)
      .useValue(new InMemoryOrderRepository())
      .overrideProvider(PROVIDER_REPOSITORY)
      .useValue(new InMemoryProviderRepository())
      .overrideProvider(PROFILE_REPOSITORY)
      .useValue(new InMemoryProfileRepository())
      .overrideProvider(CATEGORY_REPOSITORY)
      .useValue(new InMemoryCategoryRepository())
      .overrideProvider(CATEGORY_SPECIALIZATION_REPOSITORY)
      .useValue(new InMemoryCategorySpecializationRepository())
      .overrideProvider(SERVICE_REPOSITORY)
      .useValue(new InMemoryServiceRepository())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(
      new AllExceptionsFilter(),
      new DomainExceptionFilter(),
    );
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();

    authHeader = `Bearer ${signTestAccessToken(app.get(ConfigService), { sub: senderIdentityId.value, role: 'CUSTOMER' })}`;
    peerAuthHeader = `Bearer ${signTestAccessToken(app.get(ConfigService), { sub: peerIdentityId.value, role: 'PROVIDER' })}`;
    strangerAuthHeader = `Bearer ${signTestAccessToken(app.get(ConfigService), { sub: 'stranger-identity', role: 'CUSTOMER' })}`;
  });

  afterEach(async () => {
    await app.close();
  });

  const createAttachmentBody = (
    overrides: Partial<Record<string, unknown>> = {},
  ) => ({
    messageId,
    fileName: 'leak-photo.jpg',
    mimeType: 'image/jpeg',
    fileSize: 204800,
    type: AttachmentType.Image,
    ...overrides,
  });

  it('POST /attachments creates an Attachment and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', authHeader)
      .send(createAttachmentBody())
      .expect(201);

    const body = response.body as AttachmentResponseDto;
    expect(body.messageId).toBe(messageId);
    expect(body.status).toBe('PENDING');
  });

  it('POST /attachments returns 404 when the Message does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', authHeader)
      .send(createAttachmentBody({ messageId: 'unknown-message' }))
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('GET /attachments/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/attachments/unknown-id')
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('DELETE /attachments/:id deletes an existing Attachment', async () => {
    const created = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', authHeader)
      .send(createAttachmentBody());
    const createdId = (created.body as AttachmentResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/attachments/${createdId}`)
      .set('Authorization', authHeader)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/attachments/${createdId}`)
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('GET /attachments lists Attachments page by page', async () => {
    await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', authHeader)
      .send(createAttachmentBody());

    const response = await request(app.getHttpServer())
      .get('/attachments')
      .set('Authorization', authHeader)
      .expect(200);

    const body = response.body as AttachmentListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('POST /attachments returns 403 when attaching to another Identity’s Message', async () => {
    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', peerAuthHeader)
      .send(createAttachmentBody())
      .expect(403);

    expect((response.body as ErrorResponseDto).error).toBe(
      'ForbiddenException',
    );
  });

  it('POST /attachments returns 400 for an unknown field', async () => {
    await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', authHeader)
      .send({ ...createAttachmentBody(), injected: 'value' })
      .expect(400);
  });

  it('POST /attachments returns 400 for a fileSize over the limit', async () => {
    await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', authHeader)
      .send(createAttachmentBody({ fileSize: 20971521 }))
      .expect(400);
  });

  it('GET /attachments only returns Attachments from the caller’s own Chats', async () => {
    await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', authHeader)
      .send(createAttachmentBody());

    const response = await request(app.getHttpServer())
      .get('/attachments')
      .set('Authorization', strangerAuthHeader)
      .expect(200);

    const body = response.body as AttachmentListResponseDto;
    expect(body.items).toHaveLength(0);
    expect(body.total).toBe(0);
  });

  it('GET /attachments still shows the chat peer the conversation’s Attachments', async () => {
    await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', authHeader)
      .send(createAttachmentBody());

    const response = await request(app.getHttpServer())
      .get('/attachments')
      .set('Authorization', peerAuthHeader)
      .expect(200);

    expect((response.body as AttachmentListResponseDto).total).toBe(1);
  });

  it('GET /attachments/:id returns 403 for an Identity outside the Chat', async () => {
    const created = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', authHeader)
      .send(createAttachmentBody());
    const createdId = (created.body as AttachmentResponseDto).id;

    await request(app.getHttpServer())
      .get(`/attachments/${createdId}`)
      .set('Authorization', strangerAuthHeader)
      .expect(403);
  });

  it('DELETE /attachments/:id returns 403 for the chat peer', async () => {
    const created = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', authHeader)
      .send(createAttachmentBody());
    const createdId = (created.body as AttachmentResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/attachments/${createdId}`)
      .set('Authorization', peerAuthHeader)
      .expect(403);
  });

  it('GET /attachments/search searches by file name', async () => {
    await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', authHeader)
      .send(createAttachmentBody());

    const response = await request(app.getHttpServer())
      .get('/attachments/search')
      .set('Authorization', authHeader)
      .query({ term: 'photo' })
      .expect(200);

    const body = response.body as AttachmentResponseDto[];
    expect(body).toHaveLength(1);
    expect(body[0].fileName).toBe('leak-photo.jpg');
  });
});
