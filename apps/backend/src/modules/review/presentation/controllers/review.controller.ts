import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReviewRoutes } from '../routes/review.routes';
import { ReviewSwagger } from '../swagger/review.swagger';
import { CreateReviewUseCase } from '../../application/use_cases/create-review.use-case';
import { UpdateReviewUseCase } from '../../application/use_cases/update-review.use-case';
import { DeleteReviewUseCase } from '../../application/use_cases/delete-review.use-case';
import { GetReviewUseCase } from '../../application/use_cases/get-review.use-case';
import { CreateReviewDto } from '../../application/dto/create-review.dto';
import { UpdateReviewDto } from '../../application/dto/update-review.dto';
import { CreateReviewCommand } from '../../application/commands/create-review.command';
import { UpdateReviewCommand } from '../../application/commands/update-review.command';
import { DeleteReviewCommand } from '../../application/commands/delete-review.command';
import { GetReviewQuery } from '../../application/queries/get-review.query';

/**
 * REST controller for Review. Only exposes routes and delegates to the
 * corresponding Use Case — no business logic lives here. Use Cases are not
 * implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Review')
@Controller(ReviewRoutes.base)
export class ReviewController {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly updateReviewUseCase: UpdateReviewUseCase,
    private readonly deleteReviewUseCase: DeleteReviewUseCase,
    private readonly getReviewUseCase: GetReviewUseCase,
  ) {}

  @Post()
  @ApiOperation(ReviewSwagger.create)
  @ApiResponse({ status: 201, description: 'Review created.' })
  create(@Body() dto: CreateReviewDto) {
    return this.createReviewUseCase.execute(
      new CreateReviewCommand(
        dto.orderId,
        dto.providerId,
        dto.reviewerIdentityId,
        dto.rating,
        dto.title,
        dto.comment,
      ),
    );
  }

  @Put(ReviewRoutes.byId)
  @ApiOperation(ReviewSwagger.update)
  @ApiResponse({ status: 200, description: 'Review updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.updateReviewUseCase.execute(
      new UpdateReviewCommand(id, dto.title, dto.comment),
    );
  }

  @Delete(ReviewRoutes.byId)
  @ApiOperation(ReviewSwagger.delete)
  @ApiResponse({ status: 200, description: 'Review deleted.' })
  remove(@Param('id') id: string) {
    return this.deleteReviewUseCase.execute(new DeleteReviewCommand(id));
  }

  @Get(ReviewRoutes.byId)
  @ApiOperation(ReviewSwagger.get)
  @ApiResponse({ status: 200, description: 'Review found.' })
  findOne(@Param('id') id: string) {
    return this.getReviewUseCase.execute(new GetReviewQuery(id));
  }
}
