import { ReviewDto } from '../../application/dto/review.dto';
import { ReviewStatus } from '../../domain/value-objects/review-status.value-object';
import { CreateReviewRequestDto } from './create-review.request.dto';
import { UpdateReviewRequestDto } from './update-review.request.dto';
import { ReviewHttpMapper } from './review-http.mapper';

describe('ReviewHttpMapper', () => {
  it('toCreateCommand() maps every field in order', () => {
    const dto: CreateReviewRequestDto = {
      orderId: 'order-1',
      providerId: 'provider-1',
      reviewerIdentityId: 'identity-1',
      rating: 5,
      title: 'Great service',
      comment: 'Fixed the leak quickly.',
    };

    const command = ReviewHttpMapper.toCreateCommand(dto);

    expect(command.orderId).toBe('order-1');
    expect(command.providerId).toBe('provider-1');
    expect(command.reviewerIdentityId).toBe('identity-1');
    expect(command.rating).toBe(5);
    expect(command.title).toBe('Great service');
    expect(command.comment).toBe('Fixed the leak quickly.');
  });

  it('toUpdateCommand() carries the id and optional fields through', () => {
    const dto: UpdateReviewRequestDto = { title: 'Updated title' };

    const command = ReviewHttpMapper.toUpdateCommand('id-1', dto);

    expect(command.id).toBe('id-1');
    expect(command.title).toBe('Updated title');
    expect(command.comment).toBeUndefined();
  });

  it('toResponse() converts Date fields to ISO strings', () => {
    const dto: ReviewDto = {
      id: 'id-1',
      orderId: 'order-1',
      providerId: 'provider-1',
      reviewerIdentityId: 'identity-1',
      rating: 5,
      title: 'Great service',
      comment: 'Fixed the leak quickly.',
      status: ReviewStatus.Pending,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const response = ReviewHttpMapper.toResponse(dto);

    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.updatedAt).toBe('2026-01-02T00:00:00.000Z');
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: ReviewDto = {
      id: 'id-1',
      orderId: 'order-1',
      providerId: 'provider-1',
      reviewerIdentityId: 'identity-1',
      rating: 5,
      title: 'Great service',
      comment: 'Fixed the leak quickly.',
      status: ReviewStatus.Pending,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    const response = ReviewHttpMapper.toListResponse({
      items: [dto],
      total: 1,
      page: 1,
      pageSize: 20,
    });

    expect(response.items).toHaveLength(1);
    expect(response.items[0].id).toBe('id-1');
    expect(response.total).toBe(1);
  });
});
