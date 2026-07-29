import { PrismaClient } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { ServiceId } from '../../../service/domain/value-objects/service-id.value-object';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { Order } from '../../domain/entities/order.entity';
import { OrderId } from '../../domain/value-objects/order-id.value-object';
import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';
import { OrderStatus } from '../../domain/value-objects/order-status.value-object';
import { PrismaOrderRepository } from './prisma-order.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 */
describe('PrismaOrderRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaOrderRepository(prisma as never);
  let identityId: string;
  let providerId: string;
  let serviceId: string;
  let categoryId: string;

  beforeAll(async () => {
    const identity = await prisma.identityModel.create({
      data: {
        id: `identity-for-order-it-${Date.now()}`,
        fullName: 'Order Integration Customer',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-ORDER-${Date.now()}`,
        birthDate: new Date('1995-06-15'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    identityId = identity.id;

    const profile = await prisma.profileModel.create({
      data: {
        id: `profile-for-order-it-${Date.now()}`,
        identityId: identity.id,
        displayName: 'Order Integration Provider',
        avatarUrl: null,
        bio: null,
        visibility: 'PUBLIC',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const providerIdentity = await prisma.identityModel.create({
      data: {
        id: `provider-identity-for-order-it-${Date.now()}`,
        fullName: 'Order Integration Provider Owner',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-ORDER-PROVIDER-${Date.now()}`,
        birthDate: new Date('1990-01-01'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const provider = await prisma.providerModel.create({
      data: {
        id: `provider-for-order-it-${Date.now()}`,
        identityId: providerIdentity.id,
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

    const category = await prisma.categoryModel.create({
      data: {
        id: `category-for-order-it-${Date.now()}`,
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

    const service = await prisma.serviceModel.create({
      data: {
        id: `service-for-order-it-${Date.now()}`,
        providerId: provider.id,
        categoryId: category.id,
        name: 'Integration Test Service',
        description: 'desc',
        basePrice: 50,
        estimatedDuration: 60,
        status: 'ACTIVE',
        type: 'STANDARD',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    serviceId = service.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function buildOrder(overrides: Partial<{ title: string }> = {}) {
    const now = new Date();
    return new Order(OrderId.create(), {
      identityId: IdentityId.fromString(identityId),
      providerId: ProviderId.fromString(providerId),
      serviceId: ServiceId.fromString(serviceId),
      categoryId: CategoryId.fromString(categoryId),
      title: overrides.title ?? 'Integration Test Order',
      description: 'desc',
      scheduledDate: new Date('2026-01-01T08:00:00Z'),
      status: OrderStatus.Pending,
      priority: OrderPriority.Medium,
      createdAt: now,
      updatedAt: now,
    });
  }

  it('saves and finds an Order by id', async () => {
    const order = buildOrder();

    await repository.save(order);
    const found = await repository.findById(order.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(order.id)).toBe(true);
    expect(found?.title).toBe(order.title);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(OrderId.create());
    expect(found).toBeNull();
  });

  it('finds Orders by identityId', async () => {
    const order = buildOrder();
    await repository.save(order);

    const results = await repository.findByIdentityId(order.identityId);

    expect(results.some((o) => o.id.equals(order.id))).toBe(true);
  });

  it('finds Orders by providerId', async () => {
    const order = buildOrder();
    await repository.save(order);

    const results = await repository.findByProviderId(order.providerId!);

    expect(results.some((o) => o.id.equals(order.id))).toBe(true);
  });

  it('finds open (unassigned) Orders by categoryId', async () => {
    const now = new Date();
    const openOrder = new Order(OrderId.create(), {
      identityId: IdentityId.fromString(identityId),
      providerId: null,
      serviceId: null,
      categoryId: CategoryId.fromString(categoryId),
      title: 'Open Integration Test Order',
      description: 'desc',
      scheduledDate: new Date('2026-01-01T08:00:00Z'),
      status: OrderStatus.Pending,
      priority: OrderPriority.Medium,
      createdAt: now,
      updatedAt: now,
    });
    await repository.save(openOrder);

    const results = await repository.findOpenByCategoryId(
      CategoryId.fromString(categoryId),
    );

    expect(results.some((o) => o.id.equals(openOrder.id))).toBe(true);
    expect(results.every((o) => o.providerId === null)).toBe(true);
  });

  it('updates an existing Order on save (upsert)', async () => {
    const order = buildOrder({ title: 'Before Update' });
    await repository.save(order);

    const updated = new Order(order.id, {
      identityId: order.identityId,
      providerId: order.providerId,
      serviceId: order.serviceId,
      categoryId: order.categoryId,
      title: 'After Update',
      description: order.description,
      scheduledDate: order.scheduledDate,
      status: OrderStatus.Cancelled,
      priority: order.priority,
      createdAt: order.createdAt,
      updatedAt: new Date(),
    });
    await repository.save(updated);

    const found = await repository.findById(order.id);
    expect(found?.title).toBe('After Update');
    expect(found?.status).toBe(OrderStatus.Cancelled);
  });

  it('lists Orders with pagination', async () => {
    await repository.save(buildOrder());
    await repository.save(buildOrder());

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(1);
  });

  it('searches Orders by title', async () => {
    const marker = `Searchable-${Date.now()}`;
    await repository.save(buildOrder({ title: marker }));

    const results = await repository.search(marker);

    expect(results.some((order) => order.title === marker)).toBe(true);
  });
});
