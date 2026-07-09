import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderRoutes } from '../routes/order.routes';
import { OrderSwagger } from '../swagger/order.swagger';
import { CreateOrderUseCase } from '../../application/use_cases/create-order.use-case';
import { UpdateOrderUseCase } from '../../application/use_cases/update-order.use-case';
import { CancelOrderUseCase } from '../../application/use_cases/cancel-order.use-case';
import { GetOrderUseCase } from '../../application/use_cases/get-order.use-case';
import { CreateOrderDto } from '../../application/dto/create-order.dto';
import { UpdateOrderDto } from '../../application/dto/update-order.dto';
import { CreateOrderCommand } from '../../application/commands/create-order.command';
import { UpdateOrderCommand } from '../../application/commands/update-order.command';
import { CancelOrderCommand } from '../../application/commands/cancel-order.command';
import { GetOrderQuery } from '../../application/queries/get-order.query';

/**
 * REST controller for Order. Only exposes routes and delegates to the
 * corresponding Use Case — no business logic lives here. Use Cases are not
 * implemented yet, so every call currently rejects with "Not implemented yet".
 */
@ApiTags('Order')
@Controller(OrderRoutes.base)
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
  ) {}

  @Post()
  @ApiOperation(OrderSwagger.create)
  @ApiResponse({ status: 201, description: 'Order created.' })
  create(@Body() dto: CreateOrderDto) {
    return this.createOrderUseCase.execute(
      new CreateOrderCommand(
        dto.identityId,
        dto.providerId,
        dto.serviceId,
        dto.title,
        dto.description,
        dto.scheduledDate,
        dto.priority,
      ),
    );
  }

  @Put(OrderRoutes.byId)
  @ApiOperation(OrderSwagger.update)
  @ApiResponse({ status: 200, description: 'Order updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.updateOrderUseCase.execute(
      new UpdateOrderCommand(
        id,
        dto.title,
        dto.description,
        dto.scheduledDate,
        dto.priority,
      ),
    );
  }

  @Put(OrderRoutes.cancel)
  @ApiOperation(OrderSwagger.cancel)
  @ApiResponse({ status: 200, description: 'Order cancelled.' })
  cancel(@Param('id') id: string) {
    return this.cancelOrderUseCase.execute(new CancelOrderCommand(id));
  }

  @Get(OrderRoutes.byId)
  @ApiOperation(OrderSwagger.get)
  @ApiResponse({ status: 200, description: 'Order found.' })
  findOne(@Param('id') id: string) {
    return this.getOrderUseCase.execute(new GetOrderQuery(id));
  }
}
