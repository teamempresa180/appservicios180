import { PrismaClient } from '@prisma/client';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Quote } from '../../domain/entities/quote.entity';
import { QuoteId } from '../../domain/value-objects/quote-id.value-object';
import { QuoteStatus } from '../../domain/value-objects/quote-status.value-object';
import { QuoteType } from '../../domain/value-objects/quote-type.value-object';
import { PrismaQuoteRepository } from './prisma-quote.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 */
describe('PrismaQuoteRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaQuoteRepository(prisma as never);
  let orderId: string;
  let providerId: string;

  beforeAll(async () => {
    const customerIdentity = await prisma.identityModel.create({
      data: {
        id: `customer-identity-for-quote-it-${Date.now()}`,
        fullName: 'Quote Integration Customer',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-QUOTE-CUSTOMER-${Date.now()}`,
        birthDate: new Date('1995-06-15'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const providerIdentity = await prisma.identityModel.create({
      data: {
        id: `provider-identity-for-quote-it-${Date.now()}`,
        fullName: 'Quote Integration Provider Owner',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-QUOTE-PROVIDER-${Date.now()}`,
        birthDate: new Date('1990-01-01'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const profile = await prisma.profileModel.create({
      data: {
        id: `profile-for-quote-it-${Date.now()}`,
        identityId: providerIdentity.id,
        displayName: 'Quote Integration Provider',
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
        id: `provider-for-quote-it-${Date.now()}`,
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
        id: `category-for-quote-it-${Date.now()}`,
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

    const service = await prisma.serviceModel.create({
      data: {
        id: `service-for-quote-it-${Date.now()}`,
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

    const order = await prisma.orderModel.create({
      data: {
        id: `order-for-quote-it-${Date.now()}`,
        identityId: customerIdentity.id,
        providerId: provider.id,
        serviceId: service.id,
        categoryId: category.id,
        title: 'Integration Test Order',
        description: 'desc',
        scheduledDate: new Date('2026-01-01T08:00:00Z'),
        status: 'PENDING',
        priority: 'MEDIUM',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    orderId = order.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function buildQuote(overrides: Partial<{ notes: string }> = {}) {
    const now = new Date();
    return new Quote(QuoteId.create(), {
      orderId: OrderId.fromString(orderId),
      providerId: ProviderId.fromString(providerId),
      proposedPrice: 100,
      estimatedDuration: 120,
      notes: overrides.notes ?? 'Integration Test Quote',
      status: QuoteStatus.Pending,
      type: QuoteType.Standard,
      createdAt: now,
      updatedAt: now,
    });
  }

  it('saves and finds a Quote by id', async () => {
    const quote = buildQuote();

    await repository.save(quote);
    const found = await repository.findById(quote.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(quote.id)).toBe(true);
    expect(found?.notes).toBe(quote.notes);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(QuoteId.create());
    expect(found).toBeNull();
  });

  it('finds Quotes by orderId', async () => {
    const quote = buildQuote();
    await repository.save(quote);

    const results = await repository.findByOrderId(quote.orderId);

    expect(results.some((q) => q.id.equals(quote.id))).toBe(true);
  });

  it('finds Quotes by providerId', async () => {
    const quote = buildQuote();
    await repository.save(quote);

    const results = await repository.findByProviderId(quote.providerId);

    expect(results.some((q) => q.id.equals(quote.id))).toBe(true);
  });

  it('updates an existing Quote on save (upsert)', async () => {
    const quote = buildQuote({ notes: 'Before Update' });
    await repository.save(quote);

    const updated = new Quote(quote.id, {
      orderId: quote.orderId,
      providerId: quote.providerId,
      proposedPrice: quote.proposedPrice,
      estimatedDuration: quote.estimatedDuration,
      notes: 'After Update',
      status: QuoteStatus.Accepted,
      type: quote.type,
      createdAt: quote.createdAt,
      updatedAt: new Date(),
    });
    await repository.save(updated);

    const found = await repository.findById(quote.id);
    expect(found?.notes).toBe('After Update');
    expect(found?.status).toBe(QuoteStatus.Accepted);
  });

  it('lists Quotes with pagination', async () => {
    await repository.save(buildQuote());
    await repository.save(buildQuote());

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(1);
  });

  it('searches Quotes by notes', async () => {
    const marker = `Searchable-${Date.now()}`;
    await repository.save(buildQuote({ notes: marker }));

    const results = await repository.search(marker);

    expect(results.some((quote) => quote.notes === marker)).toBe(true);
  });
});
