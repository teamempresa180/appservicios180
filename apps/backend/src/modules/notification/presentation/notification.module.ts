import { Module } from '@nestjs/common';
import { NotificationController } from './controllers/notification.controller';
import { CreateNotificationUseCase } from '../application/use_cases/create-notification.use-case';
import { MarkNotificationAsReadUseCase } from '../application/use_cases/mark-notification-as-read.use-case';
import { DeleteNotificationUseCase } from '../application/use_cases/delete-notification.use-case';
import { GetNotificationUseCase } from '../application/use_cases/get-notification.use-case';
import { NotificationRepository } from '../domain/interfaces/notification-repository.interface';

/**
 * Wires the Notification presentation layer to its Use Cases.
 *
 * No concrete NotificationRepository exists yet (Infrastructure layer is
 * not built). Each Use Case is constructed with an unset repository
 * reference — this is safe because every Use Case currently throws before
 * touching it.
 */
@Module({
  controllers: [NotificationController],
  providers: [
    {
      provide: CreateNotificationUseCase,
      useFactory: () =>
        new CreateNotificationUseCase(
          undefined as unknown as NotificationRepository,
        ),
    },
    {
      provide: MarkNotificationAsReadUseCase,
      useFactory: () =>
        new MarkNotificationAsReadUseCase(
          undefined as unknown as NotificationRepository,
        ),
    },
    {
      provide: DeleteNotificationUseCase,
      useFactory: () =>
        new DeleteNotificationUseCase(
          undefined as unknown as NotificationRepository,
        ),
    },
    {
      provide: GetNotificationUseCase,
      useFactory: () =>
        new GetNotificationUseCase(
          undefined as unknown as NotificationRepository,
        ),
    },
  ],
})
export class NotificationPresentationModule {}
