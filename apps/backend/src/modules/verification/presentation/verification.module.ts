import { Module } from '@nestjs/common';
import { VerificationController } from './controllers/verification.controller';
import { CreateVerificationUseCase } from '../application/use_cases/create-verification.use-case';
import { UpdateVerificationUseCase } from '../application/use_cases/update-verification.use-case';
import { GetVerificationUseCase } from '../application/use_cases/get-verification.use-case';
import { VerificationRepository } from '../domain/interfaces/verification-repository.interface';

/**
 * Wires the Verification presentation layer to its Use Cases.
 *
 * No concrete VerificationRepository exists yet (Infrastructure layer is
 * not built). Each Use Case is constructed with an unset repository
 * reference — this is safe because every Use Case currently throws before
 * touching it.
 */
@Module({
  controllers: [VerificationController],
  providers: [
    {
      provide: CreateVerificationUseCase,
      useFactory: () =>
        new CreateVerificationUseCase(
          undefined as unknown as VerificationRepository,
        ),
    },
    {
      provide: UpdateVerificationUseCase,
      useFactory: () =>
        new UpdateVerificationUseCase(
          undefined as unknown as VerificationRepository,
        ),
    },
    {
      provide: GetVerificationUseCase,
      useFactory: () =>
        new GetVerificationUseCase(
          undefined as unknown as VerificationRepository,
        ),
    },
  ],
})
export class VerificationPresentationModule {}
