import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import request from 'supertest';
import { App } from 'supertest/types';
import { CategoryPresentationModule } from '../src/modules/category/presentation/category.module';
import { ConfigModule } from '../src/config/config.module';
import { ConfigService } from '../src/config/config.service';
import { JwtStrategy } from '../src/common/auth/jwt.strategy';
import { signTestAccessToken } from './support/sign-test-token';
import { CATEGORY_REPOSITORY } from '../src/modules/category/domain/interfaces/category-repository.interface';
import { InMemoryCategoryRepository } from '../src/modules/category/application/use_cases/test-support/in-memory-category.repository';
import { CategoryType } from '../src/modules/category/domain/value-objects/category-type.value-object';
import { CategoryResponseDto } from '../src/modules/category/presentation/dto/category.response.dto';
import { CategoryListResponseDto } from '../src/modules/category/presentation/dto/category-list.response.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { DomainExceptionFilter } from '../src/common/filters/domain-exception.filter';
import { ErrorResponseDto } from '../src/common/swagger/error-response.dto';

/**
 * HTTP integration test for the Category controller — same reasoning
 * as `identity.e2e-spec.ts`. `Category` is a standalone catalog
 * entity, so only `CATEGORY_REPOSITORY` needs overriding with an
 * in-memory fake (no cross-module dependency to seed).
 */
describe('CategoryController (e2e)', () => {
  let app: INestApplication<App>;
  let authHeader: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        CategoryPresentationModule,
      ],
      providers: [JwtStrategy],
    })
      .overrideProvider(CATEGORY_REPOSITORY)
      .useValue(new InMemoryCategoryRepository())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(
      new AllExceptionsFilter(),
      new DomainExceptionFilter(),
    );
    await app.init();

    authHeader = `Bearer ${signTestAccessToken(app.get(ConfigService), { sub: 'test-identity', role: 'CUSTOMER' })}`;
  });

  afterEach(async () => {
    await app.close();
  });

  const createCategoryBody = () => ({
    name: 'Plumbing',
    description: 'Plumbing-related home services.',
    icon: 'wrench-icon',
    color: '#0088CC',
    type: CategoryType.Standard,
  });

  it('POST /categories creates a Category and returns 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', authHeader)
      .send(createCategoryBody())
      .expect(201);

    const body = response.body as CategoryResponseDto;
    expect(body.name).toBe('Plumbing');
    expect(body.status).toBe('ACTIVE');
  });

  it('POST /categories returns 400 for a missing name', async () => {
    const response = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', authHeader)
      .send({ ...createCategoryBody(), name: '' })
      .expect(400);

    expect((response.body as ErrorResponseDto).error).toBe(
      'ValidationException',
    );
  });

  it('GET /categories/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer())
      .get('/categories/unknown-id')
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('PUT /categories/:id updates the name', async () => {
    const created = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', authHeader)
      .send(createCategoryBody());
    const createdId = (created.body as CategoryResponseDto).id;

    const response = await request(app.getHttpServer())
      .put(`/categories/${createdId}`)
      .set('Authorization', authHeader)
      .send({ name: 'Updated Name' })
      .expect(200);

    expect((response.body as CategoryResponseDto).name).toBe('Updated Name');
  });

  it('DELETE /categories/:id deletes an existing Category', async () => {
    const created = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', authHeader)
      .send(createCategoryBody());
    const createdId = (created.body as CategoryResponseDto).id;

    await request(app.getHttpServer())
      .delete(`/categories/${createdId}`)
      .set('Authorization', authHeader)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/categories/${createdId}`)
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('GET /categories lists Categories page by page', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', authHeader)
      .send(createCategoryBody());

    const response = await request(app.getHttpServer())
      .get('/categories')
      .set('Authorization', authHeader)
      .expect(200);

    const body = response.body as CategoryListResponseDto;
    expect(body.items).toHaveLength(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });

  it('GET /categories/search searches by name', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', authHeader)
      .send(createCategoryBody());

    const response = await request(app.getHttpServer())
      .get('/categories/search')
      .set('Authorization', authHeader)
      .query({ term: 'Plumbing' })
      .expect(200);

    const body = response.body as CategoryResponseDto[];
    expect(body).toHaveLength(1);
    expect(body[0].name).toBe('Plumbing');
  });
});
