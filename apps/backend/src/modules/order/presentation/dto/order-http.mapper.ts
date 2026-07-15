import { PaginatedResult } from '../../../core/application/paginated-result';
import { CreateOrderCommand } from '../../application/commands/create-order.command';
import { UpdateOrderCommand } from '../../application/commands/update-order.command';
import { OrderDto } from '../../application/dto/order.dto';
import { CreateOrderRequestDto } from './create-order.request.dto';
import { UpdateOrderRequestDto } from './update-order.request.dto';
import { OrderResponseDto } from './order.response.dto';
import { OrderListResponseDto } from './order-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `OrderController` never builds a
 * `CreateOrderCommand` or an `OrderResponseDto` by hand.
 * `scheduledDate` is parsed here (ISO string → `Date`); malformed
 * input still reaches `OrderValidator.validateCreate`, which already
 * rejects a non-`Date`/invalid `Date` — no validation logic is
 * duplicated here.
 */
export class OrderHttpMapper {
  static toCreateCommand(dto: CreateOrderRequestDto): CreateOrderCommand {
    return new CreateOrderCommand(
      dto.identityId,
      dto.providerId,
      dto.serviceId,
      dto.title,
      dto.description,
      new Date(dto.scheduledDate),
      dto.priority,
    );
  }

  static toUpdateCommand(
    id: string,
    dto: UpdateOrderRequestDto,
  ): UpdateOrderCommand {
    return new UpdateOrderCommand(
      id,
      dto.title,
      dto.description,
      dto.scheduledDate !== undefined ? new Date(dto.scheduledDate) : undefined,
      dto.priority,
    );
  }

  static toResponse(dto: OrderDto): OrderResponseDto {
    const response = new OrderResponseDto();
    response.id = dto.id;
    response.identityId = dto.identityId;
    response.providerId = dto.providerId;
    response.serviceId = dto.serviceId;
    response.title = dto.title;
    response.description = dto.description;
    response.scheduledDate = dto.scheduledDate.toISOString();
    response.status = dto.status;
    response.priority = dto.priority;
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    return response;
  }

  static toListResponse(
    result: PaginatedResult<OrderDto>,
  ): OrderListResponseDto {
    const response = new OrderListResponseDto();
    response.items = result.items.map((item) =>
      OrderHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
