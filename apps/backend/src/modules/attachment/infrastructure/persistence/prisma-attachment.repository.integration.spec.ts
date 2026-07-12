import { PrismaClient } from '@prisma/client';
import { MessageId } from '../../../message/domain/value-objects/message-id.value-object';
import { Attachment } from '../../domain/entities/attachment.entity';
import { AttachmentId } from '../../domain/value-objects/attachment-id.value-object';
import { AttachmentStatus } from '../../domain/value-objects/attachment-status.value-object';
import { AttachmentType } from '../../domain/value-objects/attachment-type.value-object';
import { PrismaAttachmentRepository } from './prisma-attachment.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 */
describe('PrismaAttachmentRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaAttachmentRepository(prisma as never);
  let messageId: string;

  beforeAll(async () => {
    const senderIdentity = await prisma.identityModel.create({
      data: {
        id: `sender-identity-for-attachment-it-${Date.now()}`,
        fullName: 'Attachment Integration Sender',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-ATTACHMENT-SENDER-${Date.now()}`,
        birthDate: new Date('1995-06-15'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const providerIdentity = await prisma.identityModel.create({
      data: {
        id: `provider-identity-for-attachment-it-${Date.now()}`,
        fullName: 'Attachment Integration Provider Owner',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-ATTACHMENT-PROVIDER-${Date.now()}`,
        birthDate: new Date('1990-01-01'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const profile = await prisma.profileModel.create({
      data: {
        id: `profile-for-attachment-it-${Date.now()}`,
        identityId: providerIdentity.id,
        displayName: 'Attachment Integration Provider',
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
        id: `provider-for-attachment-it-${Date.now()}`,
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
        id: `category-for-attachment-it-${Date.now()}`,
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
        id: `service-for-attachment-it-${Date.now()}`,
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
        id: `order-for-attachment-it-${Date.now()}`,
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
        id: `chat-for-attachment-it-${Date.now()}`,
        orderId: order.id,
        clientIdentityId: senderIdentity.id,
        providerId: provider.id,
        status: 'ACTIVE',
        type: 'ORDER_RELATED',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const message = await prisma.messageModel.create({
      data: {
        id: `message-for-attachment-it-${Date.now()}`,
        chatId: chat.id,
        senderIdentityId: senderIdentity.id,
        content: 'Here is the photo',
        type: 'TEXT',
        status: 'SENT',
        sentAt: new Date(),
        readAt: null,
      },
    });
    messageId = message.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function buildAttachment(overrides: Partial<{ fileName: string }> = {}) {
    return new Attachment(AttachmentId.create(), {
      messageId: MessageId.fromString(messageId),
      fileName: overrides.fileName ?? 'photo.jpg',
      mimeType: 'image/jpeg',
      fileSize: 2048,
      type: AttachmentType.Image,
      status: AttachmentStatus.Pending,
      createdAt: new Date(),
    });
  }

  it('saves and finds an Attachment by id', async () => {
    const attachment = buildAttachment();

    await repository.save(attachment);
    const found = await repository.findById(attachment.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(attachment.id)).toBe(true);
    expect(found?.fileName).toBe(attachment.fileName);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(AttachmentId.create());
    expect(found).toBeNull();
  });

  it('finds Attachments by messageId', async () => {
    const attachment = buildAttachment();
    await repository.save(attachment);

    const results = await repository.findByMessageId(attachment.messageId);

    expect(results.some((a) => a.id.equals(attachment.id))).toBe(true);
  });

  it('deletes an Attachment', async () => {
    const attachment = buildAttachment();
    await repository.save(attachment);

    await repository.delete(attachment.id);

    const found = await repository.findById(attachment.id);
    expect(found).toBeNull();
  });

  it('lists Attachments with pagination', async () => {
    await repository.save(buildAttachment());
    await repository.save(buildAttachment());

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(1);
  });

  it('searches Attachments by fileName', async () => {
    const marker = `searchable-${Date.now()}.jpg`;
    await repository.save(buildAttachment({ fileName: marker }));

    const results = await repository.search(marker);

    expect(results.some((attachment) => attachment.fileName === marker)).toBe(
      true,
    );
  });
});
