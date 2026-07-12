import { PrismaClient } from '@prisma/client';
import { ChatId } from '../../../chat/domain/value-objects/chat-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Message } from '../../domain/entities/message.entity';
import { MessageId } from '../../domain/value-objects/message-id.value-object';
import { MessageStatus } from '../../domain/value-objects/message-status.value-object';
import { MessageType } from '../../domain/value-objects/message-type.value-object';
import { PrismaMessageRepository } from './prisma-message.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 */
describe('PrismaMessageRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaMessageRepository(prisma as never);
  let chatId: string;
  let senderIdentityId: string;

  beforeAll(async () => {
    const senderIdentity = await prisma.identityModel.create({
      data: {
        id: `sender-identity-for-message-it-${Date.now()}`,
        fullName: 'Message Integration Sender',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-MESSAGE-SENDER-${Date.now()}`,
        birthDate: new Date('1995-06-15'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    senderIdentityId = senderIdentity.id;

    const providerIdentity = await prisma.identityModel.create({
      data: {
        id: `provider-identity-for-message-it-${Date.now()}`,
        fullName: 'Message Integration Provider Owner',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-MESSAGE-PROVIDER-${Date.now()}`,
        birthDate: new Date('1990-01-01'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const profile = await prisma.profileModel.create({
      data: {
        id: `profile-for-message-it-${Date.now()}`,
        identityId: providerIdentity.id,
        displayName: 'Message Integration Provider',
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
        id: `provider-for-message-it-${Date.now()}`,
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

    const category = await prisma.categoryModel.create({
      data: {
        id: `category-for-message-it-${Date.now()}`,
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
        id: `service-for-message-it-${Date.now()}`,
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
        id: `order-for-message-it-${Date.now()}`,
        identityId: senderIdentity.id,
        providerId: provider.id,
        serviceId: service.id,
        title: 'Integration Test Order',
        description: 'desc',
        scheduledDate: new Date('2026-01-01T08:00:00Z'),
        status: 'PENDING',
        priority: 'MEDIUM',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const chat = await prisma.chatModel.create({
      data: {
        id: `chat-for-message-it-${Date.now()}`,
        orderId: order.id,
        clientIdentityId: senderIdentity.id,
        providerId: provider.id,
        status: 'ACTIVE',
        type: 'ORDER_RELATED',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    chatId = chat.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function buildMessage(overrides: Partial<{ content: string }> = {}) {
    const now = new Date();
    return new Message(MessageId.create(), {
      chatId: ChatId.fromString(chatId),
      senderIdentityId: IdentityId.fromString(senderIdentityId),
      content: overrides.content ?? 'Integration Test Message',
      type: MessageType.Text,
      status: MessageStatus.Sent,
      sentAt: now,
      readAt: null,
    });
  }

  it('saves and finds a Message by id', async () => {
    const message = buildMessage();

    await repository.save(message);
    const found = await repository.findById(message.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(message.id)).toBe(true);
    expect(found?.content).toBe(message.content);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(MessageId.create());
    expect(found).toBeNull();
  });

  it('finds Messages by chatId', async () => {
    const message = buildMessage();
    await repository.save(message);

    const results = await repository.findByChatId(message.chatId);

    expect(results.some((m) => m.id.equals(message.id))).toBe(true);
  });

  it('finds Messages by senderIdentityId', async () => {
    const message = buildMessage();
    await repository.save(message);

    const results = await repository.findBySenderIdentityId(
      message.senderIdentityId,
    );

    expect(results.some((m) => m.id.equals(message.id))).toBe(true);
  });

  it('deletes a Message', async () => {
    const message = buildMessage();
    await repository.save(message);

    await repository.delete(message.id);

    const found = await repository.findById(message.id);
    expect(found).toBeNull();
  });

  it('lists Messages with pagination', async () => {
    await repository.save(buildMessage());
    await repository.save(buildMessage());

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(1);
  });

  it('searches Messages by content', async () => {
    const marker = `Searchable-${Date.now()}`;
    await repository.save(buildMessage({ content: marker }));

    const results = await repository.search(marker);

    expect(results.some((message) => message.content === marker)).toBe(true);
  });
});
