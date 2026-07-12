import { PrismaClient } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { QuoteId } from '../../../quote/domain/value-objects/quote-id.value-object';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentId } from '../../domain/value-objects/payment-id.value-object';
import { PaymentMethod } from '../../domain/value-objects/payment-method.value-object';
import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';
import { PrismaPaymentRepository } from './prisma-payment.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 */
describe('PrismaPaymentRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaPaymentRepository(prisma as never);
  let quoteId: string;
  let orderId: string;
  let payerIdentityId: string;
  let providerId: string;

  beforeAll(async () => {
    const payerIdentity = await prisma.identityModel.create({
      data: {
        id: `payer-identity-for-payment-it-${Date.now()}`,
        fullName: 'Payment Integration Payer',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-PAYMENT-PAYER-${Date.now()}`,
        birthDate: new Date('1995-06-15'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    payerIdentityId = payerIdentity.id;

    const providerIdentity = await prisma.identityModel.create({
      data: {
        id: `provider-identity-for-payment-it-${Date.now()}`,
        fullName: 'Payment Integration Provider Owner',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-PAYMENT-PROVIDER-${Date.now()}`,
        birthDate: new Date('1990-01-01'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const profile = await prisma.profileModel.create({
      data: {
        id: `profile-for-payment-it-${Date.now()}`,
        identityId: providerIdentity.id,
        displayName: 'Payment Integration Provider',
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
        id: `provider-for-payment-it-${Date.now()}`,
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
        id: `category-for-payment-it-${Date.now()}`,
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
        id: `service-for-payment-it-${Date.now()}`,
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
        id: `order-for-payment-it-${Date.now()}`,
        identityId: payerIdentity.id,
        providerId: provider.id,
        serviceId: service.id,
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

    const quote = await prisma.quoteModel.create({
      data: {
        id: `quote-for-payment-it-${Date.now()}`,
        orderId: order.id,
        providerId: provider.id,
        proposedPrice: 100,
        estimatedDuration: 120,
        notes: 'Integration Test Quote',
        status: 'ACCEPTED',
        type: 'STANDARD',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    quoteId = quote.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function buildPayment(overrides: Partial<{ amount: number }> = {}) {
    const now = new Date();
    return new Payment(PaymentId.create(), {
      quoteId: QuoteId.fromString(quoteId),
      orderId: OrderId.fromString(orderId),
      payerIdentityId: IdentityId.fromString(payerIdentityId),
      receiverProviderId: ProviderId.fromString(providerId),
      amount: overrides.amount ?? 100,
      method: PaymentMethod.Card,
      status: PaymentStatus.Pending,
      createdAt: now,
      updatedAt: now,
    });
  }

  it('saves and finds a Payment by id', async () => {
    const payment = buildPayment();

    await repository.save(payment);
    const found = await repository.findById(payment.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(payment.id)).toBe(true);
    expect(found?.amount).toBe(payment.amount);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(PaymentId.create());
    expect(found).toBeNull();
  });

  it('finds Payments by quoteId', async () => {
    const payment = buildPayment();
    await repository.save(payment);

    const results = await repository.findByQuoteId(payment.quoteId);

    expect(results.some((p) => p.id.equals(payment.id))).toBe(true);
  });

  it('finds Payments by orderId', async () => {
    const payment = buildPayment();
    await repository.save(payment);

    const results = await repository.findByOrderId(payment.orderId);

    expect(results.some((p) => p.id.equals(payment.id))).toBe(true);
  });

  it('finds Payments by payerIdentityId', async () => {
    const payment = buildPayment();
    await repository.save(payment);

    const results = await repository.findByPayerIdentityId(
      payment.payerIdentityId,
    );

    expect(results.some((p) => p.id.equals(payment.id))).toBe(true);
  });

  it('finds Payments by receiverProviderId', async () => {
    const payment = buildPayment();
    await repository.save(payment);

    const results = await repository.findByReceiverProviderId(
      payment.receiverProviderId,
    );

    expect(results.some((p) => p.id.equals(payment.id))).toBe(true);
  });

  it('updates an existing Payment on save (upsert)', async () => {
    const payment = buildPayment({ amount: 50 });
    await repository.save(payment);

    const updated = new Payment(payment.id, {
      quoteId: payment.quoteId,
      orderId: payment.orderId,
      payerIdentityId: payment.payerIdentityId,
      receiverProviderId: payment.receiverProviderId,
      amount: payment.amount,
      method: payment.method,
      status: PaymentStatus.Completed,
      createdAt: payment.createdAt,
      updatedAt: new Date(),
    });
    await repository.save(updated);

    const found = await repository.findById(payment.id);
    expect(found?.status).toBe(PaymentStatus.Completed);
  });

  it('lists Payments with pagination', async () => {
    await repository.save(buildPayment());
    await repository.save(buildPayment());

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(1);
  });

  it('searches Payments by method', async () => {
    await repository.save(buildPayment());

    const results = await repository.search('card');

    expect(
      results.some((payment) => payment.method === PaymentMethod.Card),
    ).toBe(true);
  });
});
