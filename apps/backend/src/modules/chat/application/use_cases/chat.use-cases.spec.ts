import { Role } from '../../../../common/auth/role.enum';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { Identity } from '../../../identity/domain/entities/identity.entity';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { DocumentType } from '../../../identity/domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { InMemoryIdentityRepository } from '../../../identity/application/use_cases/test-support/in-memory-identity.repository';
import { Provider } from '../../../provider/domain/entities/provider.entity';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { ProviderType } from '../../../provider/domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../../../provider/domain/value-objects/provider-experience.value-object';
import { ProviderStatus } from '../../../provider/domain/value-objects/provider-status.value-object';
import { InMemoryProviderRepository } from '../../../provider/application/use_cases/test-support/in-memory-provider.repository';
import { ProfileId } from '../../../profiles/domain/value-objects/profile-id.value-object';
import { Category } from '../../../category/domain/entities/category.entity';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { CategoryType } from '../../../category/domain/value-objects/category-type.value-object';
import { CategoryStatus } from '../../../category/domain/value-objects/category-status.value-object';
import { InMemoryCategoryRepository } from '../../../category/application/use_cases/test-support/in-memory-category.repository';
import { Service } from '../../../service/domain/entities/service.entity';
import { ServiceId } from '../../../service/domain/value-objects/service-id.value-object';
import { ServiceStatus } from '../../../service/domain/value-objects/service-status.value-object';
import { ServiceType } from '../../../service/domain/value-objects/service-type.value-object';
import { InMemoryServiceRepository } from '../../../service/application/use_cases/test-support/in-memory-service.repository';
import { Order } from '../../../order/domain/entities/order.entity';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { OrderStatus } from '../../../order/domain/value-objects/order-status.value-object';
import { OrderPriority } from '../../../order/domain/value-objects/order-priority.value-object';
import { InMemoryOrderRepository } from '../../../order/application/use_cases/test-support/in-memory-order.repository';
import { ChatType } from '../../domain/value-objects/chat-type.value-object';
import { ChatStatus } from '../../domain/value-objects/chat-status.value-object';
import { CreateChatCommand } from '../commands/create-chat.command';
import { CloseChatCommand } from '../commands/close-chat.command';
import { GetChatQuery } from '../queries/get-chat.query';
import { ListChatQuery } from '../queries/list-chat.query';
import { SearchChatQuery } from '../queries/search-chat.query';
import { ChatParticipationService } from '../services/chat-participation.service';
import { InMemoryChatRepository } from './test-support/in-memory-chat.repository';
import { CreateChatUseCase } from './create-chat.use-case';
import { GetChatUseCase } from './get-chat.use-case';
import { CloseChatUseCase } from './close-chat.use-case';
import { ListChatUseCase } from './list-chat.use-case';
import { SearchChatUseCase } from './search-chat.use-case';

describe('Chat use cases', () => {
  let repository: InMemoryChatRepository;
  let orderRepository: InMemoryOrderRepository;
  let identityRepository: InMemoryIdentityRepository;
  let providerRepository: InMemoryProviderRepository;
  let orderId: string;
  let clientIdentityId: string;
  let providerId: string;
  let providerIdentityId: string;
  let caller: AuthenticatedUser;
  let participation: ChatParticipationService;

  beforeEach(async () => {
    repository = new InMemoryChatRepository();
    orderRepository = new InMemoryOrderRepository();
    identityRepository = new InMemoryIdentityRepository();
    providerRepository = new InMemoryProviderRepository();
    const serviceRepository = new InMemoryServiceRepository();
    const categoryRepository = new InMemoryCategoryRepository();

    const now = new Date();
    const client = new Identity(IdentityId.create(), {
      fullName: 'Chat Client',
      documentType: DocumentType.NationalId,
      documentNumber: '123456789',
      birthDate: new Date('1990-01-01'),
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(client);
    clientIdentityId = client.id.value;

    const provider = new Provider(ProviderId.create(), {
      identityId: IdentityId.create(),
      providerProfileId: ProfileId.create(),
      status: ProviderStatus.Active,
      type: ProviderType.Independent,
      experience: ProviderExperience.Intermediate,
      biography: 'bio',
      yearsOfExperience: 5,
      createdAt: now,
      updatedAt: now,
    });
    await providerRepository.save(provider);
    providerId = provider.id.value;
    providerIdentityId = provider.identityId.value;
    caller = { id: clientIdentityId, role: Role.Customer };
    participation = new ChatParticipationService(providerRepository);

    const category = new Category(CategoryId.create(), {
      name: 'Plumbing',
      description: 'Pipes and water systems',
      icon: 'icon',
      color: '#000',
      status: CategoryStatus.Active,
      type: CategoryType.Standard,
      createdAt: now,
      updatedAt: now,
    });
    await categoryRepository.save(category);

    const service = new Service(ServiceId.create(), {
      providerId: provider.id,
      categoryId: category.id,
      name: 'Pipe Repair',
      description: 'Fixes leaking pipes',
      basePrice: 50,
      estimatedDuration: 60,
      status: ServiceStatus.Active,
      type: ServiceType.Standard,
      createdAt: now,
      updatedAt: now,
    });
    await serviceRepository.save(service);

    const order = new Order(OrderId.create(), {
      identityId: client.id,
      providerId: provider.id,
      serviceId: service.id,
      categoryId: service.categoryId,
      addressId: null,
      title: 'Fix the sink',
      description: 'The kitchen sink is leaking',
      scheduledDate: new Date('2026-01-01T08:00:00Z'),
      status: OrderStatus.Pending,
      priority: OrderPriority.Medium,
      createdAt: now,
      updatedAt: now,
    });
    await orderRepository.save(order);
    orderId = order.id.value;
  });

  function createCommand() {
    return new CreateChatCommand(
      orderId,
      clientIdentityId,
      providerId,
      ChatType.OrderRelated,
      caller,
    );
  }

  function useCase() {
    return new CreateChatUseCase(
      repository,
      orderRepository,
      identityRepository,
      providerRepository,
    );
  }

  describe('CreateChatUseCase', () => {
    it('creates a Chat in Active status', async () => {
      const dto = await useCase().execute(createCommand());

      expect(dto.orderId).toBe(orderId);
      expect(dto.clientIdentityId).toBe(clientIdentityId);
      expect(dto.providerId).toBe(providerId);
      expect(dto.status).toBe(ChatStatus.Active);
    });

    it('throws NotFoundException when the Order does not exist', async () => {
      await expect(
        useCase().execute(
          new CreateChatCommand(
            'unknown-order',
            clientIdentityId,
            providerId,
            ChatType.OrderRelated,
            caller,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when the client Identity does not exist', async () => {
      await expect(
        useCase().execute(
          new CreateChatCommand(
            orderId,
            'unknown-identity',
            providerId,
            ChatType.OrderRelated,
            caller,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when the Provider does not exist', async () => {
      await expect(
        useCase().execute(
          new CreateChatCommand(
            orderId,
            clientIdentityId,
            'unknown-provider',
            ChatType.OrderRelated,
            caller,
          ),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects an invalid type', async () => {
      await expect(
        useCase().execute(
          new CreateChatCommand(
            orderId,
            clientIdentityId,
            providerId,
            'INVALID' as ChatType,
            caller,
          ),
        ),
      ).rejects.toThrow(ValidationException);
    });

    it('lets the provider side open the conversation', async () => {
      const dto = await useCase().execute(
        new CreateChatCommand(
          orderId,
          clientIdentityId,
          providerId,
          ChatType.OrderRelated,
          { id: providerIdentityId, role: Role.Provider },
        ),
      );

      expect(dto.providerId).toBe(providerId);
    });

    it('throws ForbiddenException when the caller is neither participant', async () => {
      await expect(
        useCase().execute(
          new CreateChatCommand(
            orderId,
            clientIdentityId,
            providerId,
            ChatType.OrderRelated,
            { id: IdentityId.create().value, role: Role.Customer },
          ),
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('GetChatUseCase', () => {
    it('returns null when it does not exist', async () => {
      const result = await new GetChatUseCase(repository, participation).execute(
        new GetChatQuery('unknown-id', caller),
      );
      expect(result).toBeNull();
    });

    it('returns the Chat when it exists', async () => {
      const created = await useCase().execute(createCommand());

      const result = await new GetChatUseCase(repository, participation).execute(
        new GetChatQuery(created.id, caller),
      );
      expect(result?.id).toBe(created.id);
    });

    it('throws ForbiddenException for a non-participant', async () => {
      const created = await useCase().execute(createCommand());

      await expect(
        new GetChatUseCase(repository, participation).execute(
          new GetChatQuery(created.id, {
            id: IdentityId.create().value,
            role: Role.Customer,
          }),
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('returns any Chat to an Admin', async () => {
      const created = await useCase().execute(createCommand());

      const result = await new GetChatUseCase(repository, participation).execute(
        new GetChatQuery(created.id, {
          id: IdentityId.create().value,
          role: Role.Admin,
        }),
      );
      expect(result?.id).toBe(created.id);
    });
  });

  describe('CloseChatUseCase', () => {
    it('closes an existing Chat', async () => {
      const created = await useCase().execute(createCommand());

      const closed = await new CloseChatUseCase(
        repository,
        participation,
      ).execute(new CloseChatCommand(created.id, caller));

      expect(closed.status).toBe(ChatStatus.Closed);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(
        new CloseChatUseCase(repository, participation).execute(
          new CloseChatCommand('unknown-id', caller),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException for a non-participant', async () => {
      const created = await useCase().execute(createCommand());

      await expect(
        new CloseChatUseCase(repository, participation).execute(
          new CloseChatCommand(created.id, {
            id: IdentityId.create().value,
            role: Role.Customer,
          }),
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('ListChatUseCase', () => {
    it('paginates results', async () => {
      await useCase().execute(createCommand());
      await useCase().execute(createCommand());

      const page = await new ListChatUseCase(repository, participation).execute(
        new ListChatQuery(caller, 1, 1),
      );

      expect(page.items).toHaveLength(1);
      expect(page.total).toBe(2);
    });

    it('hides Chats the caller does not take part in', async () => {
      await useCase().execute(createCommand());

      const page = await new ListChatUseCase(repository, participation).execute(
        new ListChatQuery({
          id: IdentityId.create().value,
          role: Role.Customer,
        }),
      );

      expect(page.items).toHaveLength(0);
      expect(page.total).toBe(0);
    });

    it('lists the Chats of the provider side', async () => {
      await useCase().execute(createCommand());

      const page = await new ListChatUseCase(repository, participation).execute(
        new ListChatQuery({ id: providerIdentityId, role: Role.Provider }),
      );

      expect(page.items).toHaveLength(1);
    });
  });

  describe('SearchChatUseCase', () => {
    it('finds Chats by type', async () => {
      await useCase().execute(createCommand());

      const results = await new SearchChatUseCase(
        repository,
        participation,
      ).execute(new SearchChatQuery('order_related', caller));

      expect(results).toHaveLength(1);
      expect(results[0].type).toBe(ChatType.OrderRelated);
    });

    it('does not leak Chats of other people', async () => {
      await useCase().execute(createCommand());

      const results = await new SearchChatUseCase(
        repository,
        participation,
      ).execute(
        new SearchChatQuery('order_related', {
          id: IdentityId.create().value,
          role: Role.Customer,
        }),
      );

      expect(results).toHaveLength(0);
    });
  });
});
