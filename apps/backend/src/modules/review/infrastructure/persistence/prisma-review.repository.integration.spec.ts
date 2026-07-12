import { PrismaClient } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Review } from '../../domain/entities/review.entity';
import { ReviewId } from '../../domain/value-objects/review-id.value-object';
import { ReviewRating } from '../../domain/value-objects/review-rating.value-object';
import { ReviewStatus } from '../../domain/value-objects/review-status.value-object';
import { PrismaReviewRepository } from './prisma-review.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 */
describe('PrismaReviewRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaReviewRepository(prisma as never);
  let orderId: string;
  let providerId: string;
  let reviewerIdentityId: string;

  beforeAll(async () => {
    const reviewerIdentity = await prisma.identityModel.create({
      data: {
        id: `reviewer-identity-for-review-it-${Date.now()}`,
        fullName: 'Review Integration Reviewer',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-REVIEW-REVIEWER-${Date.now()}`,
        birthDate: new Date('1995-06-15'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    reviewerIdentityId = reviewerIdentity.id;

    const providerIdentity = await prisma.identityModel.create({
      data: {
        id: `provider-identity-for-review-it-${Date.now()}`,
        fullName: 'Review Integration Provider Owner',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-REVIEW-PROVIDER-${Date.now()}`,
        birthDate: new Date('1990-01-01'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const profile = await prisma.profileModel.create({
      data: {
        id: `profile-for-review-it-${Date.now()}`,
        identityId: providerIdentity.id,
        displayName: 'Review Integration Provider',
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
        id: `provider-for-review-it-${Date.now()}`,
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
        id: `category-for-review-it-${Date.now()}`,
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
        id: `service-for-review-it-${Date.now()}`,
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
        id: `order-for-review-it-${Date.now()}`,
        identityId: reviewerIdentity.id,
        providerId: provider.id,
        serviceId: service.id,
        title: 'Integration Test Order',
        description: 'desc',
        scheduledDate: new Date('2026-01-01T08:00:00Z'),
        status: 'COMPLETED',
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

  function buildReview(overrides: Partial<{ title: string }> = {}) {
    const now = new Date();
    return new Review(ReviewId.create(), {
      orderId: OrderId.fromString(orderId),
      providerId: ProviderId.fromString(providerId),
      reviewerIdentityId: IdentityId.fromString(reviewerIdentityId),
      rating: ReviewRating.of(5),
      title: overrides.title ?? 'Integration Test Review',
      comment: 'desc',
      status: ReviewStatus.Pending,
      createdAt: now,
      updatedAt: now,
    });
  }

  it('saves and finds a Review by id', async () => {
    const review = buildReview();

    await repository.save(review);
    const found = await repository.findById(review.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(review.id)).toBe(true);
    expect(found?.title).toBe(review.title);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(ReviewId.create());
    expect(found).toBeNull();
  });

  it('finds Reviews by orderId', async () => {
    const review = buildReview();
    await repository.save(review);

    const results = await repository.findByOrderId(review.orderId);

    expect(results.some((r) => r.id.equals(review.id))).toBe(true);
  });

  it('finds Reviews by providerId', async () => {
    const review = buildReview();
    await repository.save(review);

    const results = await repository.findByProviderId(review.providerId);

    expect(results.some((r) => r.id.equals(review.id))).toBe(true);
  });

  it('finds Reviews by reviewerIdentityId', async () => {
    const review = buildReview();
    await repository.save(review);

    const results = await repository.findByReviewerIdentityId(
      review.reviewerIdentityId,
    );

    expect(results.some((r) => r.id.equals(review.id))).toBe(true);
  });

  it('updates an existing Review on save (upsert)', async () => {
    const review = buildReview({ title: 'Before Update' });
    await repository.save(review);

    const updated = new Review(review.id, {
      orderId: review.orderId,
      providerId: review.providerId,
      reviewerIdentityId: review.reviewerIdentityId,
      rating: review.rating,
      title: 'After Update',
      comment: review.comment,
      status: review.status,
      createdAt: review.createdAt,
      updatedAt: new Date(),
    });
    await repository.save(updated);

    const found = await repository.findById(review.id);
    expect(found?.title).toBe('After Update');
  });

  it('deletes a Review', async () => {
    const review = buildReview();
    await repository.save(review);

    await repository.delete(review.id);

    const found = await repository.findById(review.id);
    expect(found).toBeNull();
  });

  it('lists Reviews with pagination', async () => {
    await repository.save(buildReview());
    await repository.save(buildReview());

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(1);
  });

  it('searches Reviews by title', async () => {
    const marker = `Searchable-${Date.now()}`;
    await repository.save(buildReview({ title: marker }));

    const results = await repository.search(marker);

    expect(results.some((review) => review.title === marker)).toBe(true);
  });
});
