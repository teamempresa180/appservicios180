import { Module } from '@nestjs/common';
import { IdentityPresentationModule } from '../../identity/presentation/identity.module';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../identity/domain/interfaces/identity-repository.interface';
import { ProviderPresentationModule } from '../../provider/presentation/provider.module';
import {
  PROVIDER_REPOSITORY,
  ProviderRepository,
} from '../../provider/domain/interfaces/provider-repository.interface';
import { ServicePresentationModule } from '../../service/presentation/service.module';
import {
  SERVICE_REPOSITORY,
  ServiceRepository,
} from '../../service/domain/interfaces/service-repository.interface';
import { CategoryPresentationModule } from '../../category/presentation/category.module';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from '../../category/domain/interfaces/category-repository.interface';
import { OrderController } from './controllers/order.controller';
import { CreateOrderUseCase } from '../application/use_cases/create-order.use-case';
import { UpdateOrderUseCase } from '../application/use_cases/update-order.use-case';
import { CancelOrderUseCase } from '../application/use_cases/cancel-order.use-case';
import { StartOrderUseCase } from '../application/use_cases/start-order.use-case';
import { CompleteOrderUseCase } from '../application/use_cases/complete-order.use-case';
import { GetOrderUseCase } from '../application/use_cases/get-order.use-case';
import { ListOrderUseCase } from '../application/use_cases/list-order.use-case';
import { SearchOrderUseCase } from '../application/use_cases/search-order.use-case';
import { ListMyOrdersUseCase } from '../application/use_cases/list-my-orders.use-case';
import { ListOrdersForProviderUseCase } from '../application/use_cases/list-orders-for-provider.use-case';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '../domain/interfaces/order-repository.interface';
import { PrismaOrderRepository } from '../infrastructure/persistence/prisma-order.repository';

/**
 * Wires the Order presentation layer to its Use Cases, which are
 * wired to the real `PrismaOrderRepository` (Sprint 3, Etapa 8) via
 * the `ORDER_REPOSITORY` DI token. Imports `IdentityPresentationModule`,
 * `ProviderPresentationModule` and `ServicePresentationModule` —
 * `CreateOrderUseCase` verifies the referenced Identity, Provider and
 * Service all exist before creating an order.
 */
@Module({
  imports: [
    IdentityPresentationModule,
    ProviderPresentationModule,
    ServicePresentationModule,
    CategoryPresentationModule,
  ],
  controllers: [OrderController],
  providers: [
    { provide: ORDER_REPOSITORY, useClass: PrismaOrderRepository },
    {
      provide: CreateOrderUseCase,
      useFactory: (
        orderRepo: OrderRepository,
        identityRepo: IdentityRepository,
        providerRepo: ProviderRepository,
        serviceRepo: ServiceRepository,
        categoryRepo: CategoryRepository,
      ) =>
        new CreateOrderUseCase(
          orderRepo,
          identityRepo,
          providerRepo,
          serviceRepo,
          categoryRepo,
        ),
      inject: [
        ORDER_REPOSITORY,
        IDENTITY_REPOSITORY,
        PROVIDER_REPOSITORY,
        SERVICE_REPOSITORY,
        CATEGORY_REPOSITORY,
      ],
    },
    {
      provide: UpdateOrderUseCase,
      useFactory: (repo: OrderRepository) => new UpdateOrderUseCase(repo),
      inject: [ORDER_REPOSITORY],
    },
    {
      provide: CancelOrderUseCase,
      useFactory: (repo: OrderRepository) => new CancelOrderUseCase(repo),
      inject: [ORDER_REPOSITORY],
    },
    {
      provide: StartOrderUseCase,
      useFactory: (repo: OrderRepository) => new StartOrderUseCase(repo),
      inject: [ORDER_REPOSITORY],
    },
    {
      provide: CompleteOrderUseCase,
      useFactory: (repo: OrderRepository) => new CompleteOrderUseCase(repo),
      inject: [ORDER_REPOSITORY],
    },
    {
      provide: GetOrderUseCase,
      useFactory: (repo: OrderRepository) => new GetOrderUseCase(repo),
      inject: [ORDER_REPOSITORY],
    },
    {
      provide: ListOrderUseCase,
      useFactory: (repo: OrderRepository) => new ListOrderUseCase(repo),
      inject: [ORDER_REPOSITORY],
    },
    {
      provide: SearchOrderUseCase,
      useFactory: (repo: OrderRepository) => new SearchOrderUseCase(repo),
      inject: [ORDER_REPOSITORY],
    },
    {
      provide: ListMyOrdersUseCase,
      useFactory: (repo: OrderRepository) => new ListMyOrdersUseCase(repo),
      inject: [ORDER_REPOSITORY],
    },
    {
      provide: ListOrdersForProviderUseCase,
      useFactory: (repo: OrderRepository, providerRepo: ProviderRepository) =>
        new ListOrdersForProviderUseCase(repo, providerRepo),
      inject: [ORDER_REPOSITORY, PROVIDER_REPOSITORY],
    },
  ],
  exports: [ORDER_REPOSITORY],
})
export class OrderPresentationModule {}
