import { ReviewController } from './review.controller';
import { CreateReviewUseCase } from '../../application/use_cases/create-review.use-case';
import { UpdateReviewUseCase } from '../../application/use_cases/update-review.use-case';
import { DeleteReviewUseCase } from '../../application/use_cases/delete-review.use-case';
import { GetReviewUseCase } from '../../application/use_cases/get-review.use-case';
import { ListReviewUseCase } from '../../application/use_cases/list-review.use-case';
import { SearchReviewUseCase } from '../../application/use_cases/search-review.use-case';
import { CreateReviewCommand } from '../../application/commands/create-review.command';
import { UpdateReviewCommand } from '../../application/commands/update-review.command';
import { DeleteReviewCommand } from '../../application/commands/delete-review.command';
import { GetReviewQuery } from '../../application/queries/get-review.query';
import { ListReviewQuery } from '../../application/queries/list-review.query';
import { SearchReviewQuery } from '../../application/queries/search-review.query';
import { Caller } from '../../../core/application/caller';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ReviewDto } from '../../application/dto/review.dto';
import { ReviewStatus } from '../../domain/value-objects/review-status.value-object';
import { CreateReviewRequestDto } from '../dto/create-review.request.dto';
import { UpdateReviewRequestDto } from '../dto/update-review.request.dto';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';

describe('ReviewController', () => {
  const user: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };
  const caller: Caller = { identityId: 'identity-1', isAdmin: false };

  let controller: ReviewController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let deleteUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };

  const reviewDto: ReviewDto = {
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

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(reviewDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(reviewDto) };
    deleteUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
    getUseCase = { execute: jest.fn().mockResolvedValue(reviewDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [reviewDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([reviewDto]) };

    controller = new ReviewController(
      createUseCase as unknown as CreateReviewUseCase,
      updateUseCase as unknown as UpdateReviewUseCase,
      deleteUseCase as unknown as DeleteReviewUseCase,
      getUseCase as unknown as GetReviewUseCase,
      listUseCase as unknown as ListReviewUseCase,
      searchUseCase as unknown as SearchReviewUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateReviewRequestDto = {
      orderId: 'order-1',
      providerId: 'provider-1',
      reviewerIdentityId: 'identity-1',
      rating: 5,
      title: 'Great service',
      comment: 'Fixed the leak quickly.',
    };

    const response = await controller.create(dto, user);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateReviewCommand(
        'order-1',
        'provider-1',
        'identity-1',
        5,
        'Great service',
        'Fixed the leak quickly.',
        caller,
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('update() maps id + request DTO + caller to a command', async () => {
    const dto: UpdateReviewRequestDto = { title: 'Updated title' };

    const response = await controller.update('id-1', dto, user);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdateReviewCommand('id-1', caller, 'Updated title', undefined),
    );
    expect(response.id).toBe('id-1');
  });

  it('remove() delegates to DeleteReviewUseCase with the id and the caller', async () => {
    await controller.remove('id-1', user);

    expect(deleteUseCase.execute).toHaveBeenCalledWith(
      new DeleteReviewCommand('id-1', caller),
    );
  });

  it('list() maps page/pageSize query params to a query and wraps the paginated result', async () => {
    const response = await controller.list('2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(
      new ListReviewQuery(2, 10),
    );
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search('great');

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchReviewQuery('great'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].title).toBe('Great service');
  });

  it('findOne() maps the Application DTO returned by GetReviewUseCase', async () => {
    const response = await controller.findOne('id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(new GetReviewQuery('id-1'));
    expect(response.title).toBe('Great service');
  });

  it('findOne() throws NotFoundException when GetReviewUseCase returns null', async () => {
    getUseCase.execute.mockResolvedValue(null);

    await expect(controller.findOne('unknown-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
