import { PrismaClient } from '@prisma/client';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Service } from '../../domain/entities/service.entity';
import { ServiceId } from '../../domain/value-objects/service-id.value-object';
import { ServiceStatus } from '../../domain/value-objects/service-status.value-object';
import { ServiceType } from '../../domain/value-objects/service-type.value-object';
import { PrismaServiceRepository } from './prisma-service.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 *
 * `providerId` now references a real `providers` row —
 * `ServiceModel.providerId` became a real `@relation` in Sprint 3,
 * Etapa 7 (see `PROJECT_STATUS.md`, section "Prompt 64").
 */
describe('PrismaServiceRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaServiceRepository(prisma as never);
  let categoryId: string;
  let providerId: string;

  beforeAll(async () => {
    const category = await prisma.categoryModel.create({
      data: {
        id: `category-for-service-it-${Date.now()}`,
        name: 'Integration Test Category',
        description: 'desc',
        icon: 'icon',
        color: '#000',
        status: 'ACTIVE',
        type: 'STANDARD',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    categoryId = category.id;

    const identity = await prisma.identityModel.create({
      data: {
        id: `identity-for-service-it-${Date.now()}`,
        fullName: 'Service Integration Owner',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-SERVICE-${Date.now()}`,
        birthDate: new Date('1995-06-15'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const profile = await prisma.profileModel.create({
      data: {
        id: `profile-for-service-it-${Date.now()}`,
        identityId: identity.id,
        displayName: 'Service Integration Owner',
        avatarUrl: null,
        bio: null,
        visibility: 'PUBLIC',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const provider = await prisma.providerModel.create({
      data: {
        id: `provider-for-service-it-${Date.now()}`,
        identityId: identity.id,
        providerProfileId: profile.id,
        status: 'ACTIVE',
        type: 'INDEPENDENT',
        experience: 'INTERMEDIATE',
        biography: 'bio',
        yearsOfExperience: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    providerId = provider.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function buildService(overrides: Partial<{ name: string }> = {}) {
    const now = new Date();
    return new Service(ServiceId.create(), {
      providerId: ProviderId.fromString(providerId),
      categoryId: CategoryId.fromString(categoryId),
      name: overrides.name ?? 'Integration Test Service',
      description: 'desc',
      basePrice: 50,
      estimatedDuration: 60,
      status: ServiceStatus.Active,
      type: ServiceType.Standard,
      createdAt: now,
      updatedAt: now,
    });
  }

  it('saves and finds a Service by id', async () => {
    const service = buildService();

    await repository.save(service);
    const found = await repository.findById(service.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(service.id)).toBe(true);
    expect(found?.name).toBe(service.name);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(ServiceId.create());
    expect(found).toBeNull();
  });

  it('finds Services by providerId', async () => {
    const service = buildService();
    await repository.save(service);

    const results = await repository.findByProviderId(service.providerId);

    expect(results.some((s) => s.id.equals(service.id))).toBe(true);
  });

  it('finds Services by categoryId', async () => {
    const service = buildService();
    await repository.save(service);

    const results = await repository.findByCategoryId(
      CategoryId.fromString(categoryId),
    );

    expect(results.some((s) => s.id.equals(service.id))).toBe(true);
  });

  it('updates an existing Service on save (upsert)', async () => {
    const service = buildService({ name: 'Before Update' });
    await repository.save(service);

    const updated = new Service(service.id, {
      providerId: service.providerId,
      categoryId: service.categoryId,
      name: 'After Update',
      description: service.description,
      basePrice: service.basePrice,
      estimatedDuration: service.estimatedDuration,
      status: service.status,
      type: service.type,
      createdAt: service.createdAt,
      updatedAt: new Date(),
    });
    await repository.save(updated);

    const found = await repository.findById(service.id);
    expect(found?.name).toBe('After Update');
  });

  it('deletes a Service', async () => {
    const service = buildService();
    await repository.save(service);

    await repository.delete(service.id);

    const found = await repository.findById(service.id);
    expect(found).toBeNull();
  });

  it('lists Services with pagination', async () => {
    await repository.save(buildService());
    await repository.save(buildService());

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(1);
  });

  it('searches Services by name', async () => {
    const marker = `Searchable-${Date.now()}`;
    await repository.save(buildService({ name: marker }));

    const results = await repository.search(marker);

    expect(results.some((service) => service.name === marker)).toBe(true);
  });
});
