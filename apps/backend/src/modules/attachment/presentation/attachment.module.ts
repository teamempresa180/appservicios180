import { Module } from '@nestjs/common';
import { MessagePresentationModule } from '../../message/presentation/message.module';
import {
  MESSAGE_REPOSITORY,
  MessageRepository,
} from '../../message/domain/interfaces/message-repository.interface';
import { AttachmentController } from './controllers/attachment.controller';
import { CreateAttachmentUseCase } from '../application/use_cases/create-attachment.use-case';
import { DeleteAttachmentUseCase } from '../application/use_cases/delete-attachment.use-case';
import { GetAttachmentUseCase } from '../application/use_cases/get-attachment.use-case';
import { ListAttachmentUseCase } from '../application/use_cases/list-attachment.use-case';
import { SearchAttachmentUseCase } from '../application/use_cases/search-attachment.use-case';
import {
  ATTACHMENT_REPOSITORY,
  AttachmentRepository,
} from '../domain/interfaces/attachment-repository.interface';
import { PrismaAttachmentRepository } from '../infrastructure/persistence/prisma-attachment.repository';

/**
 * Wires the Attachment presentation layer to its Use Cases, which are
 * wired to the real `PrismaAttachmentRepository` (Sprint 3, Etapa 10)
 * via the `ATTACHMENT_REPOSITORY` DI token. Imports
 * `MessagePresentationModule` — `CreateAttachmentUseCase` verifies the
 * referenced Message exists before creating an attachment.
 */
@Module({
  imports: [MessagePresentationModule],
  controllers: [AttachmentController],
  providers: [
    { provide: ATTACHMENT_REPOSITORY, useClass: PrismaAttachmentRepository },
    {
      provide: CreateAttachmentUseCase,
      useFactory: (
        attachmentRepo: AttachmentRepository,
        messageRepo: MessageRepository,
      ) => new CreateAttachmentUseCase(attachmentRepo, messageRepo),
      inject: [ATTACHMENT_REPOSITORY, MESSAGE_REPOSITORY],
    },
    {
      provide: DeleteAttachmentUseCase,
      useFactory: (repo: AttachmentRepository) =>
        new DeleteAttachmentUseCase(repo),
      inject: [ATTACHMENT_REPOSITORY],
    },
    {
      provide: GetAttachmentUseCase,
      useFactory: (repo: AttachmentRepository) =>
        new GetAttachmentUseCase(repo),
      inject: [ATTACHMENT_REPOSITORY],
    },
    {
      provide: ListAttachmentUseCase,
      useFactory: (repo: AttachmentRepository) =>
        new ListAttachmentUseCase(repo),
      inject: [ATTACHMENT_REPOSITORY],
    },
    {
      provide: SearchAttachmentUseCase,
      useFactory: (repo: AttachmentRepository) =>
        new SearchAttachmentUseCase(repo),
      inject: [ATTACHMENT_REPOSITORY],
    },
  ],
  exports: [ATTACHMENT_REPOSITORY],
})
export class AttachmentPresentationModule {}
