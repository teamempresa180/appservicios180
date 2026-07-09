import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { CreatePaymentUseCase } from '../application/use_cases/create-payment.use-case';
import { UpdatePaymentUseCase } from '../application/use_cases/update-payment.use-case';
import { CancelPaymentUseCase } from '../application/use_cases/cancel-payment.use-case';
import { GetPaymentUseCase } from '../application/use_cases/get-payment.use-case';
import { PaymentRepository } from '../domain/interfaces/payment-repository.interface';

/**
 * Wires the Payment presentation layer to its Use Cases.
 *
 * No concrete PaymentRepository exists yet (Infrastructure layer is not
 * built). Each Use Case is constructed with an unset repository reference —
 * this is safe because every Use Case currently throws before touching it.
 */
@Module({
  controllers: [PaymentController],
  providers: [
    {
      provide: CreatePaymentUseCase,
      useFactory: () =>
        new CreatePaymentUseCase(undefined as unknown as PaymentRepository),
    },
    {
      provide: UpdatePaymentUseCase,
      useFactory: () =>
        new UpdatePaymentUseCase(undefined as unknown as PaymentRepository),
    },
    {
      provide: CancelPaymentUseCase,
      useFactory: () =>
        new CancelPaymentUseCase(undefined as unknown as PaymentRepository),
    },
    {
      provide: GetPaymentUseCase,
      useFactory: () =>
        new GetPaymentUseCase(undefined as unknown as PaymentRepository),
    },
  ],
})
export class PaymentPresentationModule {}
