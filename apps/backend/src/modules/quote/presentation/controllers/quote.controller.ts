import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../../common/swagger/error-response.dto';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { QuoteRoutes } from '../routes/quote.routes';
import { QuoteSwagger } from '../swagger/quote.swagger';
import { CreateQuoteUseCase } from '../../application/use_cases/create-quote.use-case';
import { UpdateQuoteUseCase } from '../../application/use_cases/update-quote.use-case';
import { AcceptQuoteUseCase } from '../../application/use_cases/accept-quote.use-case';
import { RejectQuoteUseCase } from '../../application/use_cases/reject-quote.use-case';
import { GetQuoteUseCase } from '../../application/use_cases/get-quote.use-case';
import { ListQuoteUseCase } from '../../application/use_cases/list-quote.use-case';
import { SearchQuoteUseCase } from '../../application/use_cases/search-quote.use-case';
import { AcceptQuoteCommand } from '../../application/commands/accept-quote.command';
import { RejectQuoteCommand } from '../../application/commands/reject-quote.command';
import { GetQuoteQuery } from '../../application/queries/get-quote.query';
import { ListQuoteQuery } from '../../application/queries/list-quote.query';
import { SearchQuoteQuery } from '../../application/queries/search-quote.query';
import { CreateQuoteRequestDto } from '../dto/create-quote.request.dto';
import { UpdateQuoteRequestDto } from '../dto/update-quote.request.dto';
import { QuoteResponseDto } from '../dto/quote.response.dto';
import { QuoteListResponseDto } from '../dto/quote-list.response.dto';
import { QuoteHttpMapper } from '../dto/quote-http.mapper';

/**
 * REST controller for Quote. Only exposes routes, maps HTTP DTOs to
 * Application commands/queries via `QuoteHttpMapper`, and delegates
 * to the corresponding Use Case — no business logic lives here.
 * `CreateQuoteUseCase` verifies the referenced Order and Provider
 * both exist (two sequential `findById` calls, not a loop — no N+1
 * risk).
 *
 * `GetQuoteUseCase.execute()` returns `QuoteDto | null` instead of
 * throwing `NotFoundException` (same pattern as `GetOrderUseCase`,
 * see `order.controller.ts` for the full rationale). This controller
 * throws the shared `NotFoundException` itself when the result is
 * `null`, so `DomainExceptionFilter` maps it to 404 exactly as it
 * does everywhere else.
 *
 * No Delete endpoint: there is no `DeleteQuoteUseCase` in the
 * Application layer — `accept`/`reject` are the only supported status
 * transitions, per Prompt 72's rule.
 *
 * `list`/`search` are declared before the dynamic `findOne(:id)` route
 * so `GET /quotes/search` resolves to `search()` rather than being
 * matched as `findOne({ id: 'search' })`.
 */
@ApiTags('Quote')
@Controller(QuoteRoutes.base)
export class QuoteController {
  constructor(
    private readonly createQuoteUseCase: CreateQuoteUseCase,
    private readonly updateQuoteUseCase: UpdateQuoteUseCase,
    private readonly acceptQuoteUseCase: AcceptQuoteUseCase,
    private readonly rejectQuoteUseCase: RejectQuoteUseCase,
    private readonly getQuoteUseCase: GetQuoteUseCase,
    private readonly listQuoteUseCase: ListQuoteUseCase,
    private readonly searchQuoteUseCase: SearchQuoteUseCase,
  ) {}

  @Post()
  @ApiOperation(QuoteSwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Quote created.',
    type: QuoteResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order or Provider not found.',
    type: ErrorResponseDto,
  })
  async create(@Body() dto: CreateQuoteRequestDto): Promise<QuoteResponseDto> {
    const quote = await this.createQuoteUseCase.execute(
      QuoteHttpMapper.toCreateCommand(dto),
    );
    return QuoteHttpMapper.toResponse(quote);
  }

  @Put(QuoteRoutes.byId)
  @ApiOperation(QuoteSwagger.update)
  @ApiParam({ name: 'id', description: 'Quote id' })
  @ApiResponse({
    status: 200,
    description: 'Quote updated.',
    type: QuoteResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Quote not found.',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateQuoteRequestDto,
  ): Promise<QuoteResponseDto> {
    const quote = await this.updateQuoteUseCase.execute(
      QuoteHttpMapper.toUpdateCommand(id, dto),
    );
    return QuoteHttpMapper.toResponse(quote);
  }

  @Put(QuoteRoutes.accept)
  @ApiOperation(QuoteSwagger.accept)
  @ApiParam({ name: 'id', description: 'Quote id' })
  @ApiResponse({
    status: 200,
    description: 'Quote accepted.',
    type: QuoteResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Quote not found.',
    type: ErrorResponseDto,
  })
  async accept(@Param('id') id: string): Promise<QuoteResponseDto> {
    const quote = await this.acceptQuoteUseCase.execute(
      new AcceptQuoteCommand(id),
    );
    return QuoteHttpMapper.toResponse(quote);
  }

  @Put(QuoteRoutes.reject)
  @ApiOperation(QuoteSwagger.reject)
  @ApiParam({ name: 'id', description: 'Quote id' })
  @ApiResponse({
    status: 200,
    description: 'Quote rejected.',
    type: QuoteResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Quote not found.',
    type: ErrorResponseDto,
  })
  async reject(@Param('id') id: string): Promise<QuoteResponseDto> {
    const quote = await this.rejectQuoteUseCase.execute(
      new RejectQuoteCommand(id),
    );
    return QuoteHttpMapper.toResponse(quote);
  }

  @Get()
  @ApiOperation(QuoteSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of Quotes.',
    type: QuoteListResponseDto,
  })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<QuoteListResponseDto> {
    const query = new ListQuoteQuery(
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listQuoteUseCase.execute(query);
    return QuoteHttpMapper.toListResponse(result);
  }

  @Get(QuoteRoutes.search)
  @ApiOperation(QuoteSwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'labor' })
  @ApiResponse({
    status: 200,
    description: 'Quotes matching the search term.',
    type: [QuoteResponseDto],
  })
  async search(@Query('term') term: string): Promise<QuoteResponseDto[]> {
    const quotes = await this.searchQuoteUseCase.execute(
      new SearchQuoteQuery(term),
    );
    return quotes.map((quote) => QuoteHttpMapper.toResponse(quote));
  }

  @Get(QuoteRoutes.byId)
  @ApiOperation(QuoteSwagger.get)
  @ApiParam({ name: 'id', description: 'Quote id' })
  @ApiResponse({
    status: 200,
    description: 'Quote found.',
    type: QuoteResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Quote not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<QuoteResponseDto> {
    const quote = await this.getQuoteUseCase.execute(new GetQuoteQuery(id));
    if (!quote) {
      throw new NotFoundException(`Quote ${id} not found`);
    }
    return QuoteHttpMapper.toResponse(quote);
  }
}
