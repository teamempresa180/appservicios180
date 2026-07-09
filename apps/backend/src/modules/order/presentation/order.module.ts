import { Module } from '@nestjs/common';
import { OrderController } from './controllers/order.controller';
import { CreateOrderUseCase } from '../application/use_cases/create-order.use-case';
import { UpdateOrderUseCase } from '../application/use_cases/update-order.use-case';
import { CancelOrderUseCase } from '../application/use_cases/cancel-order.use-case';
import { GetOrderUseCase } from '../application/use_cases/get-order.use-case';
import { OrderRepository } from '../domain/interfaces/order-repository.interface';

/**
 * Wires the Order presentation layer to its Use Cases.
 *
 * No concrete OrderRepository exists yet (Infrastructure layer is not
 * built). Each Use Case is constructed with an unset repository reference —
 * this is safe because every Use Case currently throws before touching it.
 */
@Module({
  controllers: [OrderController],
  providers: [
    {
      provide: CreateOrderUseCase,
      useFactory: () =>
        new CreateOrderUseCase(undefined as unknown as OrderRepository),
    },
    {
      provide: UpdateOrderUseCase,
      useFactory: () =>
        new UpdateOrderUseCase(undefined as unknown as OrderRepository),
    },
    {
      provide: CancelOrderUseCase,
      useFactory: () =>
        new CancelOrderUseCase(undefined as unknown as OrderRepository),
    },
    {
      provide: GetOrderUseCase,
      useFactory: () =>
        new GetOrderUseCase(undefined as unknown as OrderRepository),
    },
  ],
})
export class OrderPresentationModule {}
