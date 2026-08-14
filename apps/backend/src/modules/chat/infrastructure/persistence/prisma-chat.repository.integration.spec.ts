import { PrismaClient } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Chat } from '../../domain/entities/chat.entity';
import { ChatId } from '../../domain/value-objects/chat-id.value-object';
import { ChatStatus } from '../../domain/value-objects/chat-status.value-object';
import { ChatType } from '../../domain/value-objects/chat-type.value-object';
import { PrismaChatRepository } from './prisma-chat.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 */
describe('PrismaChatRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaChatRepository(prisma as never);
  let orderId: string;
  let clientIdentityId: string;
  let providerId: string;

  beforeAll(async () => {
    const clientIdentity = await prisma.identityModel.create({
      data: {
        id: `client-identity-for-chat-it-${Date.now()}`,
        fullName: 'Chat Integration Client',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-CHAT-CLIENT-${Date.now()}`,
        birthDate: new Date('1995-06-15'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    clientIdentityId = clientIdentity.id;

    const providerIdentity = await prisma.identityModel.create({
      data: {
        id: `provider-identity-for-chat-it-${Date.now()}`,
        fullName: 'Chat Integration Provider Owner',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-CHAT-PROVIDER-${Date.now()}`,
        birthDate: new Date('1990-01-01'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const profile = await prisma.profileModel.create({
      data: {
        id: `profile-for-chat-it-${Date.now()}`,
        identityId: providerIdentity.id,
        displayName: 'Chat Integration Provider',
        avatarUrl: null,
        bio: null,
        visibility: 'PUBLIC',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const provider = await prisma.providerModel.create({
      data: {
        id: `provider-for-chat-it-${Date.now()}`,
        identityId: providerIdentity.id,
        providerProfileId: profile.id,
        status: 'ACTIVE',
        type: 'INDEPENDENT',
        experience: 'INTERMEDIATE',
        biography: 'bio',
        yearsOfExperience: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    providerId = provider.id;

    const category = await prisma.categoryModel.create({
      data: {
        id: `category-for-chat-it-${Date.now()}`,
        name: 'Integration Test Category',
        description: 'desc',
        icon: 'icon',
        color: '#000',
        status: 'ACTIVE',
        type: 'STANDARD',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const service = await prisma.serviceModel.create({
      data: {
        id: `service-for-chat-it-${Date.now()}`,
        providerId: provider.id,
        categoryId: category.id,
        name: 'Integration Test Service',
        description: 'desc',
        basePrice: 50,
        estimatedDuration: 60,
        status: 'ACTIVE',
        type: 'STANDARD',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const order = await prisma.orderModel.create({
      data: {
        id: `order-for-chat-it-${Date.now()}`,
        identityId: clientIdentity.id,
        providerId: provider.id,
        serviceId: service.id,
        categoryId: category.id,
        title: 'Integration Test Order',
        description: 'desc',
        scheduledDate: new Date('2026-01-01T08:00:00Z'),
        status: 'PENDING',
        priority: 'MEDIUM',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    orderId = order.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function buildChat() {
    const now = new Date();
    return new Chat(ChatId.create(), {
      orderId: OrderId.fromString(orderId),
      clientIdentityId: IdentityId.fromString(clientIdentityId),
      providerId: ProviderId.fromString(providerId),
      status: ChatStatus.Active,
      type: ChatType.OrderRelated,
      createdAt: now,
      updatedAt: now,
    });
  }

  it('saves and finds a Chat by id', async () => {
    const chat = buildChat();

    await repository.save(chat);
    const found = await repository.findById(chat.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(chat.id)).toBe(true);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(ChatId.create());
    expect(found).toBeNull();
  });

  it('finds Chats by orderId', async () => {
    const chat = buildChat();
    await repository.save(chat);

    const results = await repository.findByOrderId(chat.orderId);

    expect(results.some((c) => c.id.equals(chat.id))).toBe(true);
  });

  it('finds Chats by clientIdentityId', async () => {
    const chat = buildChat();
    await repository.save(chat);

    const results = await repository.findByClientIdentityId(
      chat.clientIdentityId,
    );

    expect(results.some((c) => c.id.equals(chat.id))).toBe(true);
  });

  it('finds Chats by providerId', async () => {
    const chat = buildChat();
    await repository.save(chat);

    const results = await repository.findByProviderId(chat.providerId);

    expect(results.some((c) => c.id.equals(chat.id))).toBe(true);
  });

  it('updates an existing Chat on save (upsert)', async () => {
    const chat = buildChat();
    await repository.save(chat);

    const updated = new Chat(chat.id, {
      orderId: chat.orderId,
      clientIdentityId: chat.clientIdentityId,
      providerId: chat.providerId,
      status: ChatStatus.Closed,
      type: chat.type,
      createdAt: chat.createdAt,
      updatedAt: new Date(),
    });
    await repository.save(updated);

    const found = await repository.findById(chat.id);
    expect(found?.status).toBe(ChatStatus.Closed);
  });

  it('lists Chats with pagination', async () => {
    await repository.save(buildChat());
    await repository.save(buildChat());

    const page = await repository.list(1, 1, null);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(1);
  });

  it('searches Chats by type', async () => {
    await repository.save(buildChat());

    const results = await repository.search('order_related', null);

    expect(results.some((chat) => chat.type === ChatType.OrderRelated)).toBe(
      true,
    );
  });
});
