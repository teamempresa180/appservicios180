import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
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
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { PaymentRoutes } from '../routes/payment.routes';
import { PaymentSwagger } from '../swagger/payment.swagger';
import { CreatePaymentUseCase } from '../../application/use_cases/create-payment.use-case';
import { UpdatePaymentUseCase } from '../../application/use_cases/update-payment.use-case';
import { CancelPaymentUseCase } from '../../application/use_cases/cancel-payment.use-case';
import { GetPaymentUseCase } from '../../application/use_cases/get-payment.use-case';
import { ListPaymentUseCase } from '../../application/use_cases/list-payment.use-case';
import { SearchPaymentUseCase } from '../../application/use_cases/search-payment.use-case';
import { CancelPaymentCommand } from '../../application/commands/cancel-payment.command';
import { GetPaymentQuery } from '../../application/queries/get-payment.query';
import { ListPaymentQuery } from '../../application/queries/list-payment.query';
import { SearchPaymentQuery } from '../../application/queries/search-payment.query';
import { CreatePaymentRequestDto } from '../dto/create-payment.request.dto';
import { UpdatePaymentRequestDto } from '../dto/update-payment.request.dto';
import { PaymentResponseDto } from '../dto/payment.response.dto';
import { PaymentListResponseDto } from '../dto/payment-list.response.dto';
import { PaymentHttpMapper } from '../dto/payment-http.mapper';

/**
 * REST controller for Payment. Only exposes routes, maps HTTP DTOs to
 * Application commands/queries via `PaymentHttpMapper`, and delegates
 * to the corresponding Use Case — no business logic lives here.
 * `CreatePaymentUseCase` verifies the referenced Quote, Order, payer
 * Identity and receiver Provider all exist (four sequential
 * `findById` calls, not a loop — no N+1 risk).
 *
 * `GetPaymentUseCase.execute()` returns `PaymentDto | null` instead
 * of throwing `NotFoundException` (same pattern as `GetOrderUseCase`/
 * `GetQuoteUseCase`). This controller throws the shared
 * `NotFoundException` itself when the result is `null`, so
 * `DomainExceptionFilter` maps it to 404 exactly as it does
 * everywhere else. This is not business logic, just translating an
 * existing Application-layer "not found" signal into the shared
 * domain exception.
 *
 * No Delete endpoint: there is no `DeletePaymentUseCase` in the
 * Application layer — `update` (status-only) and `cancel` are the
 * only supported mutations besides Create.
 *
 * `search` is declared before the dynamic `findOne(:id)` route so
 * `GET /payments/search` resolves to `search()` rather than being
 * matched as `findOne({ id: 'search' })`.
 */
@ApiTags('Payment')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller(PaymentRoutes.base)
export class PaymentController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly updatePaymentUseCase: UpdatePaymentUseCase,
    private readonly cancelPaymentUseCase: CancelPaymentUseCase,
    private readonly getPaymentUseCase: GetPaymentUseCase,
    private readonly listPaymentUseCase: ListPaymentUseCase,
    private readonly searchPaymentUseCase: SearchPaymentUseCase,
  ) {}

  @Post()
  @ApiOperation(PaymentSwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Payment created.',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Quote, Order, payer Identity or receiver Provider not found.',
    type: ErrorResponseDto,
  })
  async create(
    @Body() dto: CreatePaymentRequestDto,
  ): Promise<PaymentResponseDto> {
    const payment = await this.createPaymentUseCase.execute(
      PaymentHttpMapper.toCreateCommand(dto),
    );
    return PaymentHttpMapper.toResponse(payment);
  }

  @Put(PaymentRoutes.byId)
  @ApiOperation(PaymentSwagger.update)
  @ApiParam({ name: 'id', description: 'Payment id' })
  @ApiResponse({
    status: 200,
    description: 'Payment updated.',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found.',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentRequestDto,
  ): Promise<PaymentResponseDto> {
    const payment = await this.updatePaymentUseCase.execute(
      PaymentHttpMapper.toUpdateCommand(id, dto),
    );
    return PaymentHttpMapper.toResponse(payment);
  }

  @Put(PaymentRoutes.cancel)
  @ApiOperation(PaymentSwagger.cancel)
  @ApiParam({ name: 'id', description: 'Payment id' })
  @ApiResponse({
    status: 200,
    description: 'Payment cancelled.',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found.',
    type: ErrorResponseDto,
  })
  async cancel(@Param('id') id: string): Promise<PaymentResponseDto> {
    const payment = await this.cancelPaymentUseCase.execute(
      new CancelPaymentCommand(id),
    );
    return PaymentHttpMapper.toResponse(payment);
  }

  @Get()
  @ApiOperation(PaymentSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of Payments.',
    type: PaymentListResponseDto,
  })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<PaymentListResponseDto> {
    const query = new ListPaymentQuery(
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listPaymentUseCase.execute(query);
    return PaymentHttpMapper.toListResponse(result);
  }

  @Get(PaymentRoutes.search)
  @ApiOperation(PaymentSwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'CARD' })
  @ApiResponse({
    status: 200,
    description: 'Payments matching the search term.',
    type: [PaymentResponseDto],
  })
  async search(@Query('term') term: string): Promise<PaymentResponseDto[]> {
    const payments = await this.searchPaymentUseCase.execute(
      new SearchPaymentQuery(term),
    );
    return payments.map((payment) => PaymentHttpMapper.toResponse(payment));
  }

  @Get(PaymentRoutes.byId)
  @ApiOperation(PaymentSwagger.get)
  @ApiParam({ name: 'id', description: 'Payment id' })
  @ApiResponse({
    status: 200,
    description: 'Payment found.',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<PaymentResponseDto> {
    const payment = await this.getPaymentUseCase.execute(
      new GetPaymentQuery(id),
    );
    if (!payment) {
      throw new NotFoundException(`Payment ${id} not found`);
    }
    return PaymentHttpMapper.toResponse(payment);
  }
}
