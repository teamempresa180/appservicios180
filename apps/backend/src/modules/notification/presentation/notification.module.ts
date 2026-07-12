import { Module } from '@nestjs/common';
import { IdentityPresentationModule } from '../../identity/presentation/identity.module';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../identity/domain/interfaces/identity-repository.interface';
import { NotificationController } from './controllers/notification.controller';
import { CreateNotificationUseCase } from '../application/use_cases/create-notification.use-case';
import { MarkNotificationAsReadUseCase } from '../application/use_cases/mark-notification-as-read.use-case';
import { DeleteNotificationUseCase } from '../application/use_cases/delete-notification.use-case';
import { GetNotificationUseCase } from '../application/use_cases/get-notification.use-case';
import { ListNotificationUseCase } from '../application/use_cases/list-notification.use-case';
import { SearchNotificationUseCase } from '../application/use_cases/search-notification.use-case';
import {
  NOTIFICATION_REPOSITORY,
  NotificationRepository,
} from '../domain/interfaces/notification-repository.interface';
import { PrismaNotificationRepository } from '../infrastructure/persistence/prisma-notification.repository';

/**
 * Wires the Notification presentation layer to its Use Cases, which
 * are wired to the real `PrismaNotificationRepository` (Sprint 3,
 * Etapa 10) via the `NOTIFICATION_REPOSITORY` DI token. Imports
 * `IdentityPresentationModule` — `CreateNotificationUseCase` verifies
 * the referenced Identity exists before creating a notification.
 */
@Module({
  imports: [IdentityPresentationModule],
  controllers: [NotificationController],
  providers: [
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: PrismaNotificationRepository,
    },
    {
      provide: CreateNotificationUseCase,
      useFactory: (
        notificationRepo: NotificationRepository,
        identityRepo: IdentityRepository,
      ) => new CreateNotificationUseCase(notificationRepo, identityRepo),
      inject: [NOTIFICATION_REPOSITORY, IDENTITY_REPOSITORY],
    },
    {
      provide: MarkNotificationAsReadUseCase,
      useFactory: (repo: NotificationRepository) =>
        new MarkNotificationAsReadUseCase(repo),
      inject: [NOTIFICATION_REPOSITORY],
    },
    {
      provide: DeleteNotificationUseCase,
      useFactory: (repo: NotificationRepository) =>
        new DeleteNotificationUseCase(repo),
      inject: [NOTIFICATION_REPOSITORY],
    },
    {
      provide: GetNotificationUseCase,
      useFactory: (repo: NotificationRepository) =>
        new GetNotificationUseCase(repo),
      inject: [NOTIFICATION_REPOSITORY],
    },
    {
      provide: ListNotificationUseCase,
      useFactory: (repo: NotificationRepository) =>
        new ListNotificationUseCase(repo),
      inject: [NOTIFICATION_REPOSITORY],
    },
    {
      provide: SearchNotificationUseCase,
      useFactory: (repo: NotificationRepository) =>
        new SearchNotificationUseCase(repo),
      inject: [NOTIFICATION_REPOSITORY],
    },
  ],
  exports: [NOTIFICATION_REPOSITORY],
})
export class NotificationPresentationModule {}
