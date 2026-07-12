import { Module } from '@nestjs/common';
import { OrderPresentationModule } from '../../order/presentation/order.module';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '../../order/domain/interfaces/order-repository.interface';
import { IdentityPresentationModule } from '../../identity/presentation/identity.module';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../identity/domain/interfaces/identity-repository.interface';
import { ProviderPresentationModule } from '../../provider/presentation/provider.module';
import {
  PROVIDER_REPOSITORY,
  ProviderRepository,
} from '../../provider/domain/interfaces/provider-repository.interface';
import { ChatController } from './controllers/chat.controller';
import { CreateChatUseCase } from '../application/use_cases/create-chat.use-case';
import { CloseChatUseCase } from '../application/use_cases/close-chat.use-case';
import { GetChatUseCase } from '../application/use_cases/get-chat.use-case';
import { ListChatUseCase } from '../application/use_cases/list-chat.use-case';
import { SearchChatUseCase } from '../application/use_cases/search-chat.use-case';
import {
  CHAT_REPOSITORY,
  ChatRepository,
} from '../domain/interfaces/chat-repository.interface';
import { PrismaChatRepository } from '../infrastructure/persistence/prisma-chat.repository';

/**
 * Wires the Chat presentation layer to its Use Cases, which are
 * wired to the real `PrismaChatRepository` (Sprint 3, Etapa 10) via
 * the `CHAT_REPOSITORY` DI token. Imports `OrderPresentationModule`,
 * `IdentityPresentationModule` and `ProviderPresentationModule` —
 * `CreateChatUseCase` verifies the referenced Order, client Identity
 * and Provider all exist before creating a chat.
 */
@Module({
  imports: [
    OrderPresentationModule,
    IdentityPresentationModule,
    ProviderPresentationModule,
  ],
  controllers: [ChatController],
  providers: [
    { provide: CHAT_REPOSITORY, useClass: PrismaChatRepository },
    {
      provide: CreateChatUseCase,
      useFactory: (
        chatRepo: ChatRepository,
        orderRepo: OrderRepository,
        identityRepo: IdentityRepository,
        providerRepo: ProviderRepository,
      ) =>
        new CreateChatUseCase(chatRepo, orderRepo, identityRepo, providerRepo),
      inject: [
        CHAT_REPOSITORY,
        ORDER_REPOSITORY,
        IDENTITY_REPOSITORY,
        PROVIDER_REPOSITORY,
      ],
    },
    {
      provide: CloseChatUseCase,
      useFactory: (repo: ChatRepository) => new CloseChatUseCase(repo),
      inject: [CHAT_REPOSITORY],
    },
    {
      provide: GetChatUseCase,
      useFactory: (repo: ChatRepository) => new GetChatUseCase(repo),
      inject: [CHAT_REPOSITORY],
    },
    {
      provide: ListChatUseCase,
      useFactory: (repo: ChatRepository) => new ListChatUseCase(repo),
      inject: [CHAT_REPOSITORY],
    },
    {
      provide: SearchChatUseCase,
      useFactory: (repo: ChatRepository) => new SearchChatUseCase(repo),
      inject: [CHAT_REPOSITORY],
    },
  ],
  exports: [CHAT_REPOSITORY],
})
export class ChatPresentationModule {}
