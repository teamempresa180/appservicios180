import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { ServiceRepository } from '../../../service/domain/interfaces/service-repository.interface';
import { ServiceId } from '../../../service/domain/value-objects/service-id.value-object';
import { Order } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { OrderId } from '../../domain/value-objects/order-id.value-object';
import { OrderStatus } from '../../domain/value-objects/order-status.value-object';
import { CreateOrderCommand } from '../commands/create-order.command';
import { OrderDto } from '../dto/order.dto';
import { OrderMapper } from '../mappers/order.mapper';
import { OrderValidator } from '../validators/order.validator';

/**
 * Creates a new Order for a customer Identity requesting a Service
 * from a Provider, always in `Pending` status. Depends on
 * `IdentityRepository`, `ProviderRepository` and `ServiceRepository`
 * to verify all three referenced records actually exist before
 * creating the order — all three already have Infrastructure
 * (Identity since Sprint 3 Etapa 2, Provider since Etapa 7, Service
 * since Etapa 6), so none of these checks is deferred.
 */
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly identityRepository: IdentityRepository,
    private readonly providerRepository: ProviderRepository,
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async execute(command: CreateOrderCommand): Promise<OrderDto> {
    OrderValidator.validateCreate(command);

    const identityId = IdentityId.fromString(command.identityId);
    const identity = await this.identityRepository.findById(identityId);
    if (!identity) {
      throw new NotFoundException(`Identity ${command.identityId} not found`);
    }

    const providerId = ProviderId.fromString(command.providerId);
    const provider = await this.providerRepository.findById(providerId);
    if (!provider) {
      throw new NotFoundException(`Provider ${command.providerId} not found`);
    }

    const serviceId = ServiceId.fromString(command.serviceId);
    const service = await this.serviceRepository.findById(serviceId);
    if (!service) {
      throw new NotFoundException(`Service ${command.serviceId} not found`);
    }

    const now = new Date();
    const order = new Order(OrderId.create(), {
      identityId,
      providerId,
      serviceId,
      title: command.title,
      description: command.description,
      scheduledDate: command.scheduledDate,
      status: OrderStatus.Pending,
      priority: command.priority,
      createdAt: now,
      updatedAt: now,
    });

    await this.orderRepository.save(order);
    return OrderMapper.toDto(order);
  }
}
