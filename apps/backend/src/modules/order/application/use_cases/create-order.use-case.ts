import { Logger } from '@nestjs/common';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { BusinessRuleException } from '../../../core/domain/exceptions/business-rule.exception';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { ServiceRepository } from '../../../service/domain/interfaces/service-repository.interface';
import { ServiceId } from '../../../service/domain/value-objects/service-id.value-object';
import { CategoryRepository } from '../../../category/domain/interfaces/category-repository.interface';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { AddressId } from '../../../address/domain/value-objects/address-id.value-object';
import { Order } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { OrderId } from '../../domain/value-objects/order-id.value-object';
import { OrderStatus } from '../../domain/value-objects/order-status.value-object';
import { CreateOrderCommand } from '../commands/create-order.command';
import { OrderDto } from '../dto/order.dto';
import { OrderMapper } from '../mappers/order.mapper';
import { OrderValidator } from '../validators/order.validator';

/**
 * Creates a new Order for a customer Identity, always in `Pending`
 * status — either a **direct hire** (`providerId`/`serviceId` both
 * given: verifies the Provider and Service both exist, and that the
 * Service actually belongs to that Provider — a mismatched pair would
 * be an inconsistent request) or an **open request** (`providerId`/
 * `serviceId` both omitted: only `categoryId` matters). `categoryId`
 * is always verified against `CategoryRepository`. Depends on
 * `IdentityRepository`/`CategoryRepository` always, and
 * `ProviderRepository`/`ServiceRepository` only for a direct hire.
 */
export class CreateOrderUseCase {
  private readonly logger = new Logger(CreateOrderUseCase.name);

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly identityRepository: IdentityRepository,
    private readonly providerRepository: ProviderRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(command: CreateOrderCommand): Promise<OrderDto> {
    OrderValidator.validateCreate(command);

    const identityId = IdentityId.fromString(command.identityId);
    const identity = await this.identityRepository.findById(identityId);
    if (!identity) {
      throw new NotFoundException(`Identity ${command.identityId} not found`);
    }

    const categoryId = CategoryId.fromString(command.categoryId);
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category ${command.categoryId} not found`);
    }

    let providerId: ProviderId | null = null;
    let serviceId: ServiceId | null = null;
    if (command.providerId && command.serviceId) {
      providerId = ProviderId.fromString(command.providerId);
      const provider = await this.providerRepository.findById(providerId);
      if (!provider) {
        throw new NotFoundException(`Provider ${command.providerId} not found`);
      }

      serviceId = ServiceId.fromString(command.serviceId);
      const service = await this.serviceRepository.findById(serviceId);
      if (!service) {
        throw new NotFoundException(`Service ${command.serviceId} not found`);
      }
      if (service.providerId.value !== provider.id.value) {
        throw new BusinessRuleException(
          `Service ${command.serviceId} does not belong to Provider ${command.providerId}`,
        );
      }
    }

    const addressId = command.addressId
      ? AddressId.fromString(command.addressId)
      : null;

    const now = new Date();
    const order = new Order(OrderId.create(), {
      identityId,
      providerId,
      serviceId,
      categoryId,
      addressId,
      title: command.title,
      description: command.description,
      scheduledDate: command.scheduledDate,
      status: OrderStatus.Pending,
      priority: command.priority,
      createdAt: now,
      updatedAt: now,
    });

    await this.orderRepository.save(order);
    this.logger.log(
      `Order created id=${order.id.value} identityId=${command.identityId} status=${order.status}`,
    );
    return OrderMapper.toDto(order);
  }
}
