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
import { OrderRoutes } from '../routes/order.routes';
import { OrderSwagger } from '../swagger/order.swagger';
import { CreateOrderUseCase } from '../../application/use_cases/create-order.use-case';
import { UpdateOrderUseCase } from '../../application/use_cases/update-order.use-case';
import { CancelOrderUseCase } from '../../application/use_cases/cancel-order.use-case';
import { GetOrderUseCase } from '../../application/use_cases/get-order.use-case';
import { ListOrderUseCase } from '../../application/use_cases/list-order.use-case';
import { SearchOrderUseCase } from '../../application/use_cases/search-order.use-case';
import { CancelOrderCommand } from '../../application/commands/cancel-order.command';
import { GetOrderQuery } from '../../application/queries/get-order.query';
import { ListOrderQuery } from '../../application/queries/list-order.query';
import { SearchOrderQuery } from '../../application/queries/search-order.query';
import { CreateOrderRequestDto } from '../dto/create-order.request.dto';
import { UpdateOrderRequestDto } from '../dto/update-order.request.dto';
import { OrderResponseDto } from '../dto/order.response.dto';
import { OrderListResponseDto } from '../dto/order-list.response.dto';
import { OrderHttpMapper } from '../dto/order-http.mapper';

/**
 * REST controller for Order. Only exposes routes, maps HTTP DTOs to
 * Application commands/queries via `OrderHttpMapper`, and delegates
 * to the corresponding Use Case — no business logic lives here.
 * `CreateOrderUseCase` verifies the referenced Identity, Provider and
 * Service all exist (three sequential `findById` calls, not a loop —
 * no N+1 risk).
 *
 * Unlike every module handled since Prompt 68,
 * `GetOrderUseCase.execute()` returns `OrderDto | null` instead of
 * throwing `NotFoundException` (same pattern as `GetQuoteUseCase`,
 * see `quote.controller.ts`). This controller throws the shared
 * `NotFoundException` itself when the result is `null` — the same
 * exception every other `Get<X>UseCase` already throws internally —
 * so `DomainExceptionFilter` maps it to 404 exactly as it does
 * everywhere else. This is not business logic, just translating an
 * existing Application-layer "not found" signal into the shared
 * domain exception.
 *
 * No Delete endpoint: there is no `DeleteOrderUseCase` in the
 * Application layer — `cancel` is the only supported status
 * transition, per Prompt 72's rule.
 *
 * `list`/`search` are declared before the dynamic `findOne(:id)` route
 * so `GET /orders/search` resolves to `search()` rather than being
 * matched as `findOne({ id: 'search' })`.
 */
@ApiTags('Order')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller(OrderRoutes.base)
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly listOrderUseCase: ListOrderUseCase,
    private readonly searchOrderUseCase: SearchOrderUseCase,
  ) {}

  @Post()
  @ApiOperation(OrderSwagger.create)
  @ApiResponse({
    status: 201,
    description: 'Order created.',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Identity, Provider or Service not found.',
    type: ErrorResponseDto,
  })
  async create(@Body() dto: CreateOrderRequestDto): Promise<OrderResponseDto> {
    const order = await this.createOrderUseCase.execute(
      OrderHttpMapper.toCreateCommand(dto),
    );
    return OrderHttpMapper.toResponse(order);
  }

  @Put(OrderRoutes.byId)
  @ApiOperation(OrderSwagger.update)
  @ApiParam({ name: 'id', description: 'Order id' })
  @ApiResponse({
    status: 200,
    description: 'Order updated.',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderRequestDto,
  ): Promise<OrderResponseDto> {
    const order = await this.updateOrderUseCase.execute(
      OrderHttpMapper.toUpdateCommand(id, dto),
    );
    return OrderHttpMapper.toResponse(order);
  }

  @Put(OrderRoutes.cancel)
  @ApiOperation(OrderSwagger.cancel)
  @ApiParam({ name: 'id', description: 'Order id' })
  @ApiResponse({
    status: 200,
    description: 'Order cancelled.',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
    type: ErrorResponseDto,
  })
  async cancel(@Param('id') id: string): Promise<OrderResponseDto> {
    const order = await this.cancelOrderUseCase.execute(
      new CancelOrderCommand(id),
    );
    return OrderHttpMapper.toResponse(order);
  }

  @Get()
  @ApiOperation(OrderSwagger.list)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of Orders.',
    type: OrderListResponseDto,
  })
  async list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<OrderListResponseDto> {
    const query = new ListOrderQuery(
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
    );
    const result = await this.listOrderUseCase.execute(query);
    return OrderHttpMapper.toListResponse(result);
  }

  @Get(OrderRoutes.search)
  @ApiOperation(OrderSwagger.search)
  @ApiQuery({ name: 'term', required: true, example: 'faucet' })
  @ApiResponse({
    status: 200,
    description: 'Orders matching the search term.',
    type: [OrderResponseDto],
  })
  async search(@Query('term') term: string): Promise<OrderResponseDto[]> {
    const orders = await this.searchOrderUseCase.execute(
      new SearchOrderQuery(term),
    );
    return orders.map((order) => OrderHttpMapper.toResponse(order));
  }

  @Get(OrderRoutes.byId)
  @ApiOperation(OrderSwagger.get)
  @ApiParam({ name: 'id', description: 'Order id' })
  @ApiResponse({
    status: 200,
    description: 'Order found.',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<OrderResponseDto> {
    const order = await this.getOrderUseCase.execute(new GetOrderQuery(id));
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return OrderHttpMapper.toResponse(order);
  }
}
