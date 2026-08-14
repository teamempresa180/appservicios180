import { Module } from '@nestjs/common';
import { ChatPresentationModule } from '../../chat/presentation/chat.module';
import {
  CHAT_REPOSITORY,
  ChatRepository,
} from '../../chat/domain/interfaces/chat-repository.interface';
import { IdentityPresentationModule } from '../../identity/presentation/identity.module';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../identity/domain/interfaces/identity-repository.interface';
import { MessageController } from './controllers/message.controller';
import { SendMessageUseCase } from '../application/use_cases/send-message.use-case';
import { DeleteMessageUseCase } from '../application/use_cases/delete-message.use-case';
import { GetMessageUseCase } from '../application/use_cases/get-message.use-case';
import { ListMessageUseCase } from '../application/use_cases/list-message.use-case';
import { SearchMessageUseCase } from '../application/use_cases/search-message.use-case';
import {
  MESSAGE_REPOSITORY,
  MessageRepository,
} from '../domain/interfaces/message-repository.interface';
import { PrismaMessageRepository } from '../infrastructure/persistence/prisma-message.repository';
import { ChatParticipationService } from '../../chat/application/services/chat-participation.service';

/**
 * Wires the Message presentation layer to its Use Cases, which are
 * wired to the real `PrismaMessageRepository` (Sprint 3, Etapa 10) via
 * the `MESSAGE_REPOSITORY` DI token. Imports `ChatPresentationModule`
 * and `IdentityPresentationModule` — `SendMessageUseCase` verifies the
 * referenced Chat and sender Identity both exist before sending a
 * message.
 */
@Module({
  imports: [ChatPresentationModule, IdentityPresentationModule],
  controllers: [MessageController],
  providers: [
    { provide: MESSAGE_REPOSITORY, useClass: PrismaMessageRepository },
    {
      provide: SendMessageUseCase,
      useFactory: (
        messageRepo: MessageRepository,
        chatRepo: ChatRepository,
        identityRepo: IdentityRepository,
        participation: ChatParticipationService,
      ) =>
        new SendMessageUseCase(
          messageRepo,
          chatRepo,
          identityRepo,
          participation,
        ),
      inject: [
        MESSAGE_REPOSITORY,
        CHAT_REPOSITORY,
        IDENTITY_REPOSITORY,
        ChatParticipationService,
      ],
    },
    {
      provide: DeleteMessageUseCase,
      useFactory: (repo: MessageRepository) => new DeleteMessageUseCase(repo),
      inject: [MESSAGE_REPOSITORY],
    },
    {
      provide: GetMessageUseCase,
      useFactory: (
        repo: MessageRepository,
        chatRepo: ChatRepository,
        participation: ChatParticipationService,
      ) => new GetMessageUseCase(repo, chatRepo, participation),
      inject: [MESSAGE_REPOSITORY, CHAT_REPOSITORY, ChatParticipationService],
    },
    {
      provide: ListMessageUseCase,
      useFactory: (
        repo: MessageRepository,
        participation: ChatParticipationService,
      ) => new ListMessageUseCase(repo, participation),
      inject: [MESSAGE_REPOSITORY, ChatParticipationService],
    },
    {
      provide: SearchMessageUseCase,
      useFactory: (
        repo: MessageRepository,
        participation: ChatParticipationService,
      ) => new SearchMessageUseCase(repo, participation),
      inject: [MESSAGE_REPOSITORY, ChatParticipationService],
    },
  ],
  exports: [MESSAGE_REPOSITORY],
})
export class MessagePresentationModule {}
