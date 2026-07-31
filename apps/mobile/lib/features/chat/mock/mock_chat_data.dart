import '../../../attachment/entities/attachment.dart';
import '../../../category/models/category_id.dart';
import '../../../attachment/models/attachment_id.dart';
import '../../../attachment/models/attachment_status.dart';
import '../../../attachment/models/attachment_type.dart';
import '../../../chat/entities/chat.dart';
import '../../../chat/models/chat_id.dart';
import '../../../chat/models/chat_status.dart';
import '../../../chat/models/chat_type.dart';
import '../../../identity/models/identity_id.dart';
import '../../../message/entities/message.dart';
import '../../../message/models/message_id.dart';
import '../../../message/models/message_status.dart';
import '../../../message/models/message_type.dart';
import '../../../order/entities/order.dart';
import '../../../order/models/order_id.dart';
import '../../../order/models/order_priority.dart';
import '../../../order/models/order_status.dart';
import '../../../profiles/entities/profile.dart';
import '../../../profiles/models/profile_id.dart';
import '../../../profiles/models/profile_status.dart';
import '../../../profiles/models/profile_visibility.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_experience.dart';
import '../../../provider/models/provider_id.dart';
import '../../../provider/models/provider_status.dart';
import '../../../provider/models/provider_type.dart';
import '../../../service/models/service_id.dart';
import '../models/conversation_summary.dart';

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

final IdentityId _clientIdentityId = IdentityId.fromString(
  'chat-identity-client',
);

/// Fixed, deterministic mock domain entities for the Chat feature.
/// Intentionally its own set — independent of every other feature's
/// mock data (see the feature README). This feature shows a single,
/// fixed conversation — there is no id-based lookup yet.
final Provider mockChatProvider = Provider(
  id: ProviderId.fromString('chat-provider-diana'),
  identityId: IdentityId.fromString('chat-identity-diana'),
  providerProfileId: ProfileId.fromString('chat-profile-diana'),
  status: ProviderStatus.active,
  type: ProviderType.independent,
  experience: ProviderExperience.advanced,
  biography:
      'Plomera independiente, especializada en reparaciones '
      'residenciales.',
  yearsOfExperience: 8,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Profile mockChatProfile = Profile(
  id: ProfileId.fromString('chat-profile-diana'),
  identityId: mockChatProvider.identityId,
  displayName: 'Diana Restrepo',
  avatarUrl: null,
  bio: mockChatProvider.biography,
  visibility: ProfileVisibility.public,
  status: ProfileStatus.active,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Order mockChatOrder = Order(
  id: OrderId.fromString('chat-order-1'),
  identityId: _clientIdentityId,
  categoryId: CategoryId.fromString('chat-category-plumbing'),
  providerId: mockChatProvider.id,
  serviceId: ServiceId.fromString('chat-service-leak-repair'),
  addressId: null,
  title: 'Reparación de fuga de agua',
  description: 'Fuga debajo del lavaplatos de la cocina.',
  scheduledDate: DateTime(2026, 1, 10, 10, 0),
  status: OrderStatus.inProgress,
  priority: OrderPriority.medium,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

final Chat mockChat = Chat(
  id: ChatId.fromString('chat-chat-1'),
  orderId: mockChatOrder.id,
  clientIdentityId: _clientIdentityId,
  providerId: mockChatProvider.id,
  status: ChatStatus.active,
  type: ChatType.orderRelated,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

/// Alternating conversation — Proveedor, Cliente, Proveedor, Cliente —
/// using only real `Message` entities. Sender is derived by comparing
/// `senderIdentityId` against `mockChatProvider.identityId`/
/// `_clientIdentityId`; no simulated "isProvider" field needed.
final List<Message> mockChatMessages = [
  Message(
    id: MessageId.fromString('chat-message-1'),
    chatId: mockChat.id,
    senderIdentityId: mockChatProvider.identityId,
    content: 'Hola, buenas tardes. Ya estoy en camino para revisar la fuga.',
    type: MessageType.text,
    status: MessageStatus.read,
    sentAt: DateTime(2026, 1, 10, 9, 30),
    readAt: DateTime(2026, 1, 10, 9, 32),
  ),
  Message(
    id: MessageId.fromString('chat-message-2'),
    chatId: mockChat.id,
    senderIdentityId: _clientIdentityId,
    content: 'Perfecto, muchas gracias. Te espero.',
    type: MessageType.text,
    status: MessageStatus.read,
    sentAt: DateTime(2026, 1, 10, 9, 33),
    readAt: DateTime(2026, 1, 10, 9, 34),
  ),
  Message(
    id: MessageId.fromString('chat-message-3'),
    chatId: mockChat.id,
    senderIdentityId: mockChatProvider.identityId,
    content: 'Llego en unos 15 minutos aproximadamente.',
    type: MessageType.text,
    status: MessageStatus.read,
    sentAt: DateTime(2026, 1, 10, 9, 45),
    readAt: DateTime(2026, 1, 10, 9, 46),
  ),
  Message(
    id: MessageId.fromString('chat-message-4'),
    chatId: mockChat.id,
    senderIdentityId: _clientIdentityId,
    content: 'De acuerdo, aquí estaré.',
    type: MessageType.text,
    status: MessageStatus.delivered,
    sentAt: DateTime(2026, 1, 10, 9, 46),
    readAt: null,
  ),
];

/// Five real `Attachment` records covering every `AttachmentType` and
/// every `AttachmentStatus` at least once. `Attachment` only
/// references `MessageId` (never `Chat`), per the domain's own rule —
/// two attachments on `chat-message-1` show that a single message can
/// carry more than one.
final List<Attachment> mockChatAttachments = [
  Attachment(
    id: AttachmentId.fromString('chat-attachment-photo'),
    messageId: mockChatMessages[0].id,
    fileName: 'foto_fuga.jpg',
    mimeType: 'image/jpeg',
    fileSize: 2400000,
    type: AttachmentType.image,
    status: AttachmentStatus.available,
    createdAt: mockChatMessages[0].sentAt,
  ),
  Attachment(
    id: AttachmentId.fromString('chat-attachment-quote'),
    messageId: mockChatMessages[0].id,
    fileName: 'cotizacion.pdf',
    mimeType: 'application/pdf',
    fileSize: 154000,
    type: AttachmentType.document,
    status: AttachmentStatus.available,
    createdAt: mockChatMessages[0].sentAt,
  ),
  Attachment(
    id: AttachmentId.fromString('chat-attachment-voice-note'),
    messageId: mockChatMessages[2].id,
    fileName: 'nota_voz.m4a',
    mimeType: 'audio/mp4',
    fileSize: 87000,
    type: AttachmentType.audio,
    status: AttachmentStatus.pending,
    createdAt: mockChatMessages[2].sentAt,
  ),
  Attachment(
    id: AttachmentId.fromString('chat-attachment-video'),
    messageId: mockChatMessages[2].id,
    fileName: 'video_diagnostico.mp4',
    mimeType: 'video/mp4',
    fileSize: 8100000,
    type: AttachmentType.video,
    status: AttachmentStatus.failed,
    createdAt: mockChatMessages[2].sentAt,
  ),
  Attachment(
    id: AttachmentId.fromString('chat-attachment-other'),
    messageId: mockChatMessages[3].id,
    fileName: 'archivo_temporal.zip',
    mimeType: 'application/zip',
    fileSize: 512000,
    type: AttachmentType.other,
    status: AttachmentStatus.removed,
    createdAt: mockChatMessages[3].sentAt,
  ),
];

/// Simulated content not modeled by any domain entity — see
/// `ChatDisplay` and the feature README for why each exists.
const bool mockChatIsOnline = true;

const String mockChatLastSeen = 'Activo hace 2 min';

const bool mockChatIsTyping = false;

/// Mock data backing the "Mensajes" conversation list
/// (`getConversations()`). The first entry mirrors [mockChat]/
/// [mockChatMessages] above (same provider, last real message, no
/// unread since every message from Diana was already read) — the rest
/// are additional fixed conversations covering unread/answered/
/// unanswered states for the filter tabs. `ConversationSummary` is a
/// display-only summary (see its own doc comment), so these don't need
/// a full backing `Chat`/`Message` graph like [mockChat] does.
final List<ConversationSummary> mockConversations = [
  ConversationSummary(
    chatId: mockChat.id,
    counterpartName: mockChatProfile.displayName,
    lastMessagePreview: mockChatMessages.last.content,
    lastMessageAt: mockChatMessages.last.sentAt,
    unreadCount: 0,
    isUnanswered: false,
  ),
  ConversationSummary(
    chatId: ChatId.fromString('chat-conversation-carlos'),
    counterpartName: 'Carlos Gómez',
    lastMessagePreview: '¿Puedes venir mañana en la mañana?',
    lastMessageAt: DateTime(2026, 1, 12, 8, 15),
    unreadCount: 2,
    isUnanswered: true,
  ),
  ConversationSummary(
    chatId: ChatId.fromString('chat-conversation-ferreteria'),
    counterpartName: 'Ferretería Central',
    lastMessagePreview: 'Con gusto, quedamos así entonces.',
    lastMessageAt: DateTime(2026, 1, 11, 17, 40),
    unreadCount: 0,
    isUnanswered: false,
  ),
  ConversationSummary(
    chatId: ChatId.fromString('chat-conversation-ana'),
    counterpartName: 'Ana Martínez',
    lastMessagePreview: 'Hola, ¿ya tienes la cotización lista?',
    lastMessageAt: DateTime(2026, 1, 9, 14, 5),
    unreadCount: 1,
    isUnanswered: true,
  ),
];
