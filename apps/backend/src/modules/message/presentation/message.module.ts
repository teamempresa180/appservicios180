import { Module } from '@nestjs/common';
import { MessageController } from './controllers/message.controller';
import { SendMessageUseCase } from '../application/use_cases/send-message.use-case';
import { DeleteMessageUseCase } from '../application/use_cases/delete-message.use-case';
import { GetMessageUseCase } from '../application/use_cases/get-message.use-case';
import { MessageRepository } from '../domain/interfaces/message-repository.interface';

/**
 * Wires the Message presentation layer to its Use Cases.
 *
 * No concrete MessageRepository exists yet (Infrastructure layer is not
 * built). Each Use Case is constructed with an unset repository reference —
 * this is safe because every Use Case currently throws before touching it.
 */
@Module({
  controllers: [MessageController],
  providers: [
    {
      provide: SendMessageUseCase,
      useFactory: () =>
        new SendMessageUseCase(undefined as unknown as MessageRepository),
    },
    {
      provide: DeleteMessageUseCase,
      useFactory: () =>
        new DeleteMessageUseCase(undefined as unknown as MessageRepository),
    },
    {
      provide: GetMessageUseCase,
      useFactory: () =>
        new GetMessageUseCase(undefined as unknown as MessageRepository),
    },
  ],
})
export class MessagePresentationModule {}
