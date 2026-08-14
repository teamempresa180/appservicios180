import {
  Body,
  Controller,
  UseGuards,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../../common/swagger/error-response.dto';
import { JwtAuthGuard } from '../../../../common/auth/jwt-auth.guard';
import { CurrentUser } from '../../../../common/auth/current-user.decorator';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { toCaller } from '../../../core/application/caller';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ReviewRoutes } from '../routes/review.routes';
import { ReviewSwagger } from '../swagger/review.swagger';
import { CreateReviewUseCase } from '../../application/use_cases/create-review.use-case';
import { UpdateReviewUseCase } from '../../application/use_cases/update-review.use-case';
import { DeleteReviewUseCase } from '../../application/use_cases/delete-review.use-case';
import { GetReviewUseCase } from '../../application/use_cases/get-review.use-case';
import { ListReviewUseCase } from '../../application/use_cases/list-review.use-case';
import { SearchReviewUseCase } from '../../application/use_cases/search-review.use-case';
import { DeleteReviewCommand } from '../../application/commands/delete-review.command';
import { GetReviewQuery } from '../../application/queries/get-review.query';
import { ListReviewQuery } from '../../application/queries/list-review.query';
import { SearchReviewQuery } from '../../application/queries/search-review.query';
import { CreateReviewRequestDto } from '../dto/create-review.request.dto';
import { UpdateReviewRequestDto } from '../dto/update-review.request.dto';
import { ReviewResponseDto } from '../dto/review.response.dto';
import { ReviewListResponseDto } from '../dto/review-list.response.dto';
import { ReviewHttpMapper } from '../dto/review-http.mapper';

/**
 * REST controller for Review. Only exposes routes, maps HTTP DTOs to
 * Application commands/queries via `ReviewHttpMapper`, and delegates
 * to the corresponding Use Case — no business logic lives here.
 * `CreateReviewUseCase` verifies the referenced Order, Provider and
 * reviewer Identity all exist (three sequential `findById` calls, not
 * a loop — no N+1 risk).
 *
 * `GetReviewUseCase.execute()` returns `ReviewDto | null` instead of
 * throwing `NotFoundException` (same pattern as `GetOrderUseCase`/
 * `GetQuoteUseCase`/`GetPaymentUseCase`). This controller throws the
 * shared `NotFoundException` itself when the result is `null`, so
 * `DomainExceptionFilter` maps it to 404 exactly as it does
 * everywhere else — not business logic, just translating an existing
 * Application-layer "not found" signal.
 *
 * No publish/hide/archive endpoint: there is no such Use Case in the
 * Application layer despite `ReviewStatus` having those members —
 * `update` only mutates `title`/`comment`, per the existing Use Case
 * contract.
 *
 * `search` is declared before the dynamic `findOne(:id)` route so
 * `GET /reviews/search` resolves to `search()` rather than being
 * matched as `findOne({ id: 'search' })`.
 *
 * Authorization here is deliberately asymmetric, and unlike the other
 * modules in this pass the reads stay open. Reviews are public
 * marketplace content — a customer has to be able to read a
 * Provider's reviews before hiring them — so `list`/`search`/
 * `findOne` return everything to any authenticated caller, with no
 * ownership filter. Only authorship is protected: create/update/
 * delete carry the caller through to the Use Case, which ties the
 * review to `reviewerIdentityId`.
 */
@ApiTags('Review')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller(ReviewRoutes.base)
export class ReviewController {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly updateReviewUseCase: UpdateReviewUseCase,
    private readonly deleteReviewUseCase: DeleteReviewUseCase,
    private readonly getReviewUseCase: GetReviewUseCase,
    private readonly listReviewUseCase: ListReviewUseCase,
    private readonly searchReviewUseCase: SearchReviewUseCase,
  ) {}

  @Post()
  @ApiOperation(ReviewSwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Review created.',
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order, Provider or reviewer Identity not found.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'reviewerIdentityId is not the calling Identity.',
    type: ErrorResponseDto,
  })
  async create(
    @Body() dto: CreateReviewRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ReviewResponseDto> {
    const review = await this.createReviewUseCase.execute(
      ReviewHttpMapper.toCreateCommand(dto, toCaller(user)),
    );
    return ReviewHttpMapper.toResponse(review);
  }

  @Put(ReviewRoutes.byId)
  @ApiOperation(ReviewSwagger.update)
  @ApiParam({ name: 'id', description: 'Review id' })
  @ApiResponse({
    status: 200,
    description: 'Review updated.',
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Caller is not the author of this Review.',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateReviewRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ReviewResponseDto> {
    const review = await this.updateReviewUseCase.execute(
      ReviewHttpMapper.toUpdateCommand(id, dto, toCaller(user)),
    );
    return ReviewHttpMapper.toResponse(review);
  }

  @Delete(ReviewRoutes.byId)
  @ApiOperation(ReviewSwagger.delete)
  @ApiParam({ name: 'id', description: 'Review id' })
  @ApiResponse({ status: 200, description: 'Review deleted.' })
  @ApiResponse({
    status: 404,
    description: 'Review not found.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Caller is not the author of this Review.',
    type: ErrorResponseDto,
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.deleteReviewUseCase.execute(
      new DeleteReviewCommand(id, toCaller(user)),
    );
  }

  @Get()
  @ApiOperation(ReviewSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of Reviews.',
    type: ReviewListResponseDto,
  })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<ReviewListResponseDto> {
    const query = new ListReviewQuery(
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listReviewUseCase.execute(query);
    return ReviewHttpMapper.toListResponse(result);
  }

  @Get(ReviewRoutes.search)
  @ApiOperation(ReviewSwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'great' })
  @ApiResponse({
    status: 200,
    description: 'Reviews matching the search term.',
    type: [ReviewResponseDto],
  })
  async search(@Query('term') term: string): Promise<ReviewResponseDto[]> {
    const reviews = await this.searchReviewUseCase.execute(
      new SearchReviewQuery(term),
    );
    return reviews.map((review) => ReviewHttpMapper.toResponse(review));
  }

  @Get(ReviewRoutes.byId)
  @ApiOperation(ReviewSwagger.get)
  @ApiParam({ name: 'id', description: 'Review id' })
  @ApiResponse({
    status: 200,
    description: 'Review found.',
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<ReviewResponseDto> {
    const review = await this.getReviewUseCase.execute(new GetReviewQuery(id));
    if (!review) {
      throw new NotFoundException(`Review ${id} not found`);
    }
    return ReviewHttpMapper.toResponse(review);
  }
}
