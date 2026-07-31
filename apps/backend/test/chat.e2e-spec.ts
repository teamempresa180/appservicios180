import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import request from 'supertest';
import { App } from 'supertest/types';
import { ChatPresentationModule } from '../src/modules/chat/presentation/chat.module';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { JwtStrategy } from '../src/common/auth/jwt.strategy';
import { signTestAccessToken } from './support/sign-test-token';
import { CHAT_REPOSITORY } from '../src/modules/chat/domain/interfaces/chat-repository.interface';
import { InMemoryChatRepository } from '../src/modules/chat/application/use_cases/test-support/in-memory-chat.repository';
import { ORDER_REPOSITORY } from '../src/modules/order/domain/interfaces/order-repository.interface';
import { InMemoryOrderRepository } from '../src/modules/order/application/use_cases/test-support/in-memory-order.repository';
import { Order } from '../src/modules/order/domain/entities/order.entity';
import { OrderId } from '../src/modules/order/domain/value-objects/order-id.value-object';
import { OrderStatus } from '../src/modules/order/domain/value-objects/order-status.value-object';
import { OrderPriority } from '../src/modules/order/domain/value-objects/order-priority.value-object';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { Identity } from '../src/modules/identity/domain/entities/identity.entity';
import { IdentityId } from '../src/modules/identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../src/modules/identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../src/modules/identity/domain/value-objects/identity-status.value-object';
import { PROVIDER_REPOSITORY } from '../src/modules/provider/domain/interfaces/provider-repository.interface';
import { InMemoryProviderRepository } from '../src/modules/provider/application/use_cases/test-support/in-memory-provider.repository';
import { Provider } from '../src/modules/provider/domain/entities/provider.entity';
import { ProviderId } from '../src/modules/provider/domain/value-objects/provider-id.value-object';
import { ProviderStatus } from '../src/modules/provider/domain/value-objects/provider-status.value-object';
import { ProviderType } from '../src/modules/provider/domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../src/modules/provider/domain/value-objects/provider-experience.value-object';
import { PROFILE_REPOSITORY } from '../src/modules/profiles/domain/interfaces/profile-repository.interface';
import { InMemoryProfileRepository } from '../src/modules/profiles/application/use_cases/test-support/in-memory-profile.repository';
import { ProfileId } from '../src/modules/profiles/domain/value-objects/profile-id.value-object';
import { CATEGORY_REPOSITORY } from '../src/modules/category/domain/interfaces/category-repository.interface';
import { InMemoryCategoryRepository } from '../src/modules/category/application/use_cases/test-support/in-memory-category.repository';
import { SERVICE_REPOSITORY } from '../src/modules/service/domain/interfaces/service-repository.interface';
import { InMemoryServiceRepository } from '../src/modules/service/application/use_cases/test-support/in-memory-service.repository';
import { ServiceId } from '../src/modules/service/domain/value-objects/service-id.value-object';
import { CategoryId } from '../src/modules/category/domain/value-objects/category-id.value-object';
import { ChatType } from '../src/modules/chat/domain/value-objects/chat-type.value-object';
import { ChatResponseDto } from '../src/modules/chat/presentation/dto/chat.response.dto';
import { ChatListResponseDto } from '../src/modules/chat/presentation/dto/chat-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Chat controller — same reasoning as
 * `payment.e2e-spec.ts`. `CHAT_REPOSITORY`, `ORDER_REPOSITORY`,
 * `IDENTITY_REPOSITORY` and `PROVIDER_REPOSITORY` (imported
 * transitively via `ChatPresentationModule`) are overridden with
 * in-memory fakes, pre-seeding one Order, one Identity and one
 * Provider. `PROFILE_REPOSITORY`/`CATEGORY_REPOSITORY`/
 * `SERVICE_REPOSITORY` are also overridden because
 * `OrderPresentationModule`/`ProviderPresentationModule` (imported
 * transitively) depend on them.
 */
describe('ChatController (e2e)', () => {
  let app: INestApplication<App>;
  let orderId: string;
  let identityId: string;
  let providerId: string;
  let authHeader: string;

  beforeEach(async () => {
    const now = new Date();

    const identityRepository = new InMemoryIdentityRepository();
    const identity = new Identity(IdentityId.create(), {
      fullName: 'Client',
      documentType: DocumentType.NationalId,
      documentNumber: '123456789',
      birthDate: now,
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(identity);
    identityId = identity.id.value;

    const providerRepository = new InMemoryProviderRepository();
    const provider = new Provider(ProviderId.create(), {
      identityId: IdentityId.create(),
      providerProfileId: ProfileId.create(),
      status: ProviderStatus.Active,
      type: ProviderType.Independent,
      experience: ProviderExperience.Intermediate,
      biography: 'Plumber with 10 years of experience.',
      yearsOfExperience: 10,
      createdAt: now,
      updatedAt: now,
    });
    await providerRepository.save(provider);
    providerId = provider.id.value;

    const orderRepository = new InMemoryOrderRepository();
    const order = new Order(OrderId.create(), {
      identityId: IdentityId.create(),
      providerId: ProviderId.create(),
      serviceId: ServiceId.create(),
      categoryId: CategoryId.create(),
      addressId: null,
      title: 'Fix leaking kitchen faucet',
      description: 'Description.',
      scheduledDate: now,
      status: OrderStatus.Pending,
      priority: OrderPriority.Medium,
      createdAt: now,
      updatedAt: now,
    });
    await orderRepository.save(order);
    orderId = order.id.value;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        ChatPresentationModule,
      ],
      providers: [JwtStrategy],
    })
      .overrideProvider(CHAT_REPOSITORY)
      .useValue(new InMemoryChatRepository())
      .overrideProvider(ORDER_REPOSITORY)
      .useValue(orderRepository)
      .overrideProvider(IDENTITY_REPOSITORY)
      .useValue(identityRepository)
      .overrideProvider(PROVIDER_REPOSITORY)
      .useValue(providerRepository)
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

  const createChatBody = (
    overrides: Partial<Record<string, unknown>> = {},
  ) => ({
    orderId,
    clientIdentityId: identityId,
    providerId,
    type: ChatType.OrderRelated,
    ...overrides,
  });

  it('POST /chats creates a Chat and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/chats')
      .set('Authorization', authHeader)
      .send(createChatBody())
      .expect(201);

    const body = response.body as ChatResponseDto;
    expect(body.orderId).toBe(orderId);
    expect(body.status).toBe('ACTIVE');
  });

  it('POST /chats returns 404 when the Order does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/chats')
      .set('Authorization', authHeader)
      .send(createChatBody({ orderId: 'unknown-order' }))
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('GET /chats/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/chats/unknown-id')
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('PUT /chats/:id/close closes an existing Chat', async () => {
    const created = await request(app.getHttpServer())
      .post('/chats')
      .set('Authorization', authHeader)
      .send(createChatBody());
    const createdId = (created.body as ChatResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/chats/${createdId}/close`)
      .set('Authorization', authHeader)
      .expect(200);

    expect((response.body as ChatResponseDto).status).toBe('CLOSED');
  });

  it('GET /chats lists Chats page by page', async () => {
    await request(app.getHttpServer())
      .post('/chats')
      .set('Authorization', authHeader)
      .send(createChatBody());

    const response = await request(app.getHttpServer())
      .get('/chats')
      .set('Authorization', authHeader)
      .expect(200);

    const body = response.body as ChatListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /chats/search searches by type', async () => {
    await request(app.getHttpServer())
      .post('/chats')
      .set('Authorization', authHeader)
      .send(createChatBody());

    const response = await request(app.getHttpServer())
      .get('/chats/search')
      .set('Authorization', authHeader)
      .query({ term: 'ORDER_RELATED' })
      .expect(200);

    const body = response.body as ChatResponseDto[];
    expect(body).toHaveLength(1);
    expect(body[0].type).toBe('ORDER_RELATED');
  });
});
