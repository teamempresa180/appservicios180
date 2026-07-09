import { Module } from '@nestjs/common';
import { AttachmentController } from './controllers/attachment.controller';
import { CreateAttachmentUseCase } from '../application/use_cases/create-attachment.use-case';
import { DeleteAttachmentUseCase } from '../application/use_cases/delete-attachment.use-case';
import { GetAttachmentUseCase } from '../application/use_cases/get-attachment.use-case';
import { AttachmentRepository } from '../domain/interfaces/attachment-repository.interface';

/**
 * Wires the Attachment presentation layer to its Use Cases.
 *
 * No concrete AttachmentRepository exists yet (Infrastructure layer is not
 * built). Each Use Case is constructed with an unset repository reference —
 * this is safe because every Use Case currently throws before touching it.
 */
@Module({
  controllers: [AttachmentController],
  providers: [
    {
      provide: CreateAttachmentUseCase,
      useFactory: () =>
        new CreateAttachmentUseCase(
          undefined as unknown as AttachmentRepository,
        ),
    },
    {
      provide: DeleteAttachmentUseCase,
      useFactory: () =>
        new DeleteAttachmentUseCase(
          undefined as unknown as AttachmentRepository,
        ),
    },
    {
      provide: GetAttachmentUseCase,
      useFactory: () =>
        new GetAttachmentUseCase(undefined as unknown as AttachmentRepository),
    },
  ],
})
export class AttachmentPresentationModule {}
