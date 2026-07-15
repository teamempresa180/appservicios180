import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ReviewPresentationModule } from '../src/modules/review/presentation/review.module';
import { REVIEW_REPOSITORY } from '../src/modules/review/domain/interfaces/review-repository.interface';
import { InMemoryReviewRepository } from '../src/modules/review/application/use_cases/test-support/in-memory-review.repository';
import { ORDER_REPOSITORY } from '../src/modules/order/domain/interfaces/order-repository.interface';
import { InMemoryOrderRepository } from '../src/modules/order/application/use_cases/test-support/in-memory-order.repository';
import { Order } from '../src/modules/order/domain/entities/order.entity';
import { OrderId } from '../src/modules/order/domain/value-objects/order-id.value-object';
import { OrderStatus } from '../src/modules/order/domain/value-objects/order-status.value-object';
import { OrderPriority } from '../src/modules/order/domain/value-objects/order-priority.value-object';
import { PROVIDER_REPOSITORY } from '../src/modules/provider/domain/interfaces/provider-repository.interface';
import { InMemoryProviderRepository } from '../src/modules/provider/application/use_cases/test-support/in-memory-provider.repository';
import { Provider } from '../src/modules/provider/domain/entities/provider.entity';
import { ProviderId } from '../src/modules/provider/domain/value-objects/provider-id.value-object';
import { ProviderStatus } from '../src/modules/provider/domain/value-objects/provider-status.value-object';
import { ProviderType } from '../src/modules/provider/domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../src/modules/provider/domain/value-objects/provider-experience.value-object';
import { IDENTITY_REPOSITORY } from '../src/modules/identity/domain/interfaces/identity-repository.interface';
import { InMemoryIdentityRepository } from '../src/modules/identity/application/use_cases/test-support/in-memory-identity.repository';
import { Identity } from '../src/modules/identity/domain/entities/identity.entity';
import { IdentityId } from '../src/modules/identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../src/modules/identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../src/modules/identity/domain/value-objects/identity-status.value-object';
import { PROFILE_REPOSITORY } from '../src/modules/profiles/domain/interfaces/profile-repository.interface';
import { InMemoryProfileRepository } from '../src/modules/profiles/application/use_cases/test-support/in-memory-profile.repository';
import { ProfileId } from '../src/modules/profiles/domain/value-objects/profile-id.value-object';
import { CATEGORY_REPOSITORY } from '../src/modules/category/domain/interfaces/category-repository.interface';
import { InMemoryCategoryRepository } from '../src/modules/category/application/use_cases/test-support/in-memory-category.repository';
import { SERVICE_REPOSITORY } from '../src/modules/service/domain/interfaces/service-repository.interface';
import { InMemoryServiceRepository } from '../src/modules/service/application/use_cases/test-support/in-memory-service.repository';
import { ServiceId } from '../src/modules/service/domain/value-objects/service-id.value-object';
import { ReviewResponseDto } from '../src/modules/review/presentation/dto/review.response.dto';
import { ReviewListResponseDto } from '../src/modules/review/presentation/dto/review-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Review controller — same reasoning as
 * `payment.e2e-spec.ts`. `REVIEW_REPOSITORY`, `ORDER_REPOSITORY`,
 * `PROVIDER_REPOSITORY` and `IDENTITY_REPOSITORY` (imported
 * transitively via `ReviewPresentationModule`) are overridden with
 * in-memory fakes, pre-seeding one Order, one Provider and one
 * Identity. `PROFILE_REPOSITORY`/`CATEGORY_REPOSITORY`/
 * `SERVICE_REPOSITORY` are also overridden because
 * `OrderPresentationModule`/`ProviderPresentationModule` (imported
 * transitively) depend on them.
 */
describe('ReviewController (e2e)', () => {
  let app: INestApplication<App>;
  let orderId: string;
  let providerId: string;
  let identityId: string;

  beforeEach(async () => {
    const now = new Date();

    const identityRepository = new InMemoryIdentityRepository();
    const identity = new Identity(IdentityId.create(), {
      fullName: 'Reviewer',
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
      imports: [ReviewPresentationModule],
    })
      .overrideProvider(REVIEW_REPOSITORY)
      .useValue(new InMemoryReviewRepository())
      .overrideProvider(ORDER_REPOSITORY)
      .useValue(orderRepository)
      .overrideProvider(PROVIDER_REPOSITORY)
      .useValue(providerRepository)
      .overrideProvider(IDENTITY_REPOSITORY)
      .useValue(identityRepository)
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
  });

  afterEach(async () => {
    await app.close();
  });

  const createReviewBody = (
    overrides: Partial<Record<string, unknown>> = {},
  ) => ({
    orderId,
    providerId,
    reviewerIdentityId: identityId,
    rating: 5,
    title: 'Great service',
    comment: 'Fixed the leak quickly and left the area clean.',
    ...overrides,
  });

  it('POST /reviews creates a Review and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/reviews')
      .send(createReviewBody())
      .expect(201);

    const body = response.body as ReviewResponseDto;
    expect(body.orderId).toBe(orderId);
    expect(body.status).toBe('PENDING');
  });

  it('POST /reviews returns 404 when the Order does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/reviews')
      .send(createReviewBody({ orderId: 'unknown-order' }))
      .expect(404);

    expect((response.body as ErrorResponseDto).error).toBe('NotFoundException');
  });

  it('GET /reviews/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer()).get('/reviews/unknown-id').expect(404);
  });

  it('PUT /reviews/:id updates the title', async () => {
    const created = await request(app.getHttpServer())
      .post('/reviews')
      .send(createReviewBody());
    const createdId = (created.body as ReviewResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/reviews/${createdId}`)
      .send({ title: 'Updated title' })
      .expect(200);

    expect((response.body as ReviewResponseDto).title).toBe('Updated title');
  });

  it('DELETE /reviews/:id deletes an existing Review', async () => {
    const created = await request(app.getHttpServer())
      .post('/reviews')
      .send(createReviewBody());
    const createdId = (created.body as ReviewResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/reviews/${createdId}`)
      .expect(200);

    await request(app.getHttpServer()).get(`/reviews/${createdId}`).expect(404);
  });

  it('GET /reviews lists Reviews page by page', async () => {
    await request(app.getHttpServer())
      .post('/reviews')
      .send(createReviewBody());

    const response = await request(app.getHttpServer())
      .get('/reviews')
      .expect(200);

    const body = response.body as ReviewListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /reviews/search searches by title/comment', async () => {
    await request(app.getHttpServer())
      .post('/reviews')
      .send(createReviewBody());

    const response = await request(app.getHttpServer())
      .get('/reviews/search')
      .query({ term: 'great' })
      .expect(200);

    const body = response.body as ReviewResponseDto[];
    expect(body).toHaveLength(1);
    expect(body[0].title).toBe('Great service');
  });
});
