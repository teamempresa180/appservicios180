import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import request from 'supertest';
import { App } from 'supertest/types';
import { MessagePresentationModule } from '../src/modules/message/presentation/message.module';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { JwtStrategy } from '../src/common/auth/jwt.strategy';
import { signTestAccessToken } from './support/sign-test-token';
import { MESSAGE_REPOSITORY } from '../src/modules/message/domain/interfaces/message-repository.interface';
import { InMemoryMessageRepository } from '../src/modules/message/application/use_cases/test-support/in-memory-message.repository';
import { CHAT_REPOSITORY } from '../src/modules/chat/domain/interfaces/chat-repository.interface';
import { InMemoryChatRepository } from '../src/modules/chat/application/use_cases/test-support/in-memory-chat.repository';
import { Chat } from '../src/modules/chat/domain/entities/chat.entity';
import { ChatId } from '../src/modules/chat/domain/value-objects/chat-id.value-object';
import { ChatStatus } from '../src/modules/chat/domain/value-objects/chat-status.value-object';
import { ChatType } from '../src/modules/chat/domain/value-objects/chat-type.value-object';
import { ORDER_REPOSITORY } from '../src/modules/order/domain/interfaces/order-repository.interface';
import { InMemoryOrderRepository } from '../src/modules/order/application/use_cases/test-support/in-memory-order.repository';
import { OrderId } from '../src/modules/order/domain/value-objects/order-id.value-object';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { Identity } from '../src/modules/identity/domain/entities/identity.entity';
import { IdentityId } from '../src/modules/identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../src/modules/identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../src/modules/identity/domain/value-objects/identity-status.value-object';
import { PROVIDER_REPOSITORY } from '../src/modules/provider/domain/interfaces/provider-repository.interface';
import { InMemoryProviderRepository } from '../src/modules/provider/application/use_cases/test-support/in-memory-provider.repository';
import { ProviderId } from '../src/modules/provider/domain/value-objects/provider-id.value-object';
import { PROFILE_REPOSITORY } from '../src/modules/profiles/domain/interfaces/profile-repository.interface';
import { InMemoryProfileRepository } from '../src/modules/profiles/application/use_cases/test-support/in-memory-profile.repository';
import { CATEGORY_REPOSITORY } from '../src/modules/category/domain/interfaces/category-repository.interface';
import { InMemoryCategoryRepository } from '../src/modules/category/application/use_cases/test-support/in-memory-category.repository';
import { SERVICE_REPOSITORY } from '../src/modules/service/domain/interfaces/service-repository.interface';
import { InMemoryServiceRepository } from '../src/modules/service/application/use_cases/test-support/in-memory-service.repository';
import { MessageType } from '../src/modules/message/domain/value-objects/message-type.value-object';
import { MessageResponseDto } from '../src/modules/message/presentation/dto/message.response.dto';
import { MessageListResponseDto } from '../src/modules/message/presentation/dto/message-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Message controller — same reasoning
 * as `chat.e2e-spec.ts`. `MESSAGE_REPOSITORY`, `CHAT_REPOSITORY` and
 * `IDENTITY_REPOSITORY` (imported transitively via
 * `MessagePresentationModule`) are overridden with in-memory fakes,
 * pre-seeding one Chat and one Identity. `ORDER_REPOSITORY`/
 * `PROVIDER_REPOSITORY`/`PROFILE_REPOSITORY`/`CATEGORY_REPOSITORY`/
 * `SERVICE_REPOSITORY` are also overridden because
 * `ChatPresentationModule` (imported transitively) pulls in
 * `OrderPresentationModule`/`ProviderPresentationModule`.
 */
describe('MessageController (e2e)', () => {
  let app: INestApplication<App>;
  let chatId: string;
  let identityId: string;
  let authHeader: string;

  beforeEach(async () => {
    const now = new Date();

    const identityRepository = new InMemoryIdentityRepository();
    const identity = new Identity(IdentityId.create(), {
      fullName: 'Sender',
      documentType: DocumentType.NationalId,
      documentNumber: '123456789',
      birthDate: now,
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(identity);
    identityId = identity.id.value;

    const chatRepository = new InMemoryChatRepository();
    const chat = new Chat(ChatId.create(), {
      orderId: OrderId.create(),
      clientIdentityId: IdentityId.create(),
      providerId: ProviderId.create(),
      status: ChatStatus.Active,
      type: ChatType.OrderRelated,
      createdAt: now,
      updatedAt: now,
    });
    await chatRepository.save(chat);
    chatId = chat.id.value;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        MessagePresentationModule,
      ],
      providers: [JwtStrategy],
    })
      .overrideProvider(MESSAGE_REPOSITORY)
      .useValue(new InMemoryMessageRepository())
      .overrideProvider(CHAT_REPOSITORY)
      .useValue(chatRepository)
      .overrideProvider(IDENTITY_REPOSITORY)
      .useValue(identityRepository)
      .overrideProvider(ORDER_REPOSITORY)
      .useValue(new InMemoryOrderRepository())
      .overrideProvider(PROVIDER_REPOSITORY)
      .useValue(new InMemoryProviderRepository())
      .overrideProvider(PROFILE_REPOSITORY)
      .useValue(new InMemoryProfileRepository())
      .overrideProvider(CATEGORY_REPOSITORY)
      .useValue(new InMemoryCategoryRepository())
      .overrideProvider(SERVICE_REPOSITORY)
      .useValue(new InMemoryServiceRepository())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(
      new AllExceptionsFilter(),
      new DomainExceptionFilter(),
    );
    await app.init();

    authHeader = `Bearer ${signTestAccessToken(app.get(ConfigService), { sub: identityId, role: 'CUSTOMER' })}`;
  });

  afterEach(async () => {
    await app.close();
  });

  const sendMessageBody = (
    overrides: Partial<Record<string, unknown>> = {},
  ) => ({
    chatId,
    senderIdentityId: identityId,
    content: 'On my way, be there in 10 minutes.',
    type: MessageType.Text,
    ...overrides,
  });

  it('POST /messages sends a Message and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/messages')
      .set('Authorization', authHeader)
      .send(sendMessageBody())
      .expect(201);

    const body = response.body as MessageResponseDto;
    expect(body.chatId).toBe(chatId);
    expect(body.status).toBe('SENT');
    expect(body.readAt).toBeNull();
  });

  it('POST /messages returns 404 when the Chat does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/messages')
      .set('Authorization', authHeader)
      .send(sendMessageBody({ chatId: 'unknown-chat' }))
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('GET /messages/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/messages/unknown-id')
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('DELETE /messages/:id deletes an existing Message', async () => {
    const created = await request(app.getHttpServer())
      .post('/messages')
      .set('Authorization', authHeader)
      .send(sendMessageBody());
    const createdId = (created.body as MessageResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/messages/${createdId}`)
      .set('Authorization', authHeader)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/messages/${createdId}`)
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('GET /messages lists Messages page by page', async () => {
    await request(app.getHttpServer())
      .post('/messages')
      .set('Authorization', authHeader)
      .send(sendMessageBody());

    const response = await request(app.getHttpServer())
      .get('/messages')
      .set('Authorization', authHeader)
      .expect(200);

    const body = response.body as MessageListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /messages/search searches by content', async () => {
    await request(app.getHttpServer())
      .post('/messages')
      .set('Authorization', authHeader)
      .send(sendMessageBody());

    const response = await request(app.getHttpServer())
      .get('/messages/search')
      .set('Authorization', authHeader)
      .query({ term: 'minutes' })
      .expect(200);

    const body = response.body as MessageResponseDto[];
    expect(body).toHaveLength(1);
    expect(body[0].content).toBe('On my way, be there in 10 minutes.');
  });
});
