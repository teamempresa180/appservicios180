import { Module } from '@nestjs/common';
import { ChatController } from './controllers/chat.controller';
import { CreateChatUseCase } from '../application/use_cases/create-chat.use-case';
import { CloseChatUseCase } from '../application/use_cases/close-chat.use-case';
import { GetChatUseCase } from '../application/use_cases/get-chat.use-case';
import { ChatRepository } from '../domain/interfaces/chat-repository.interface';

/**
 * Wires the Chat presentation layer to its Use Cases.
 *
 * No concrete ChatRepository exists yet (Infrastructure layer is not
 * built). Each Use Case is constructed with an unset repository reference —
 * this is safe because every Use Case currently throws before touching it.
 */
@Module({
  controllers: [ChatController],
  providers: [
    {
      provide: CreateChatUseCase,
      useFactory: () =>
        new CreateChatUseCase(undefined as unknown as ChatRepository),
    },
    {
      provide: CloseChatUseCase,
      useFactory: () =>
        new CloseChatUseCase(undefined as unknown as ChatRepository),
    },
    {
      provide: GetChatUseCase,
      useFactory: () =>
        new GetChatUseCase(undefined as unknown as ChatRepository),
    },
  ],
})
export class ChatPresentationModule {}
