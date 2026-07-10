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
  biography: 'Plomera independiente, especializada en reparaciones '
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
  providerId: mockChatProvider.id,
  serviceId: ServiceId.fromString('chat-service-leak-repair'),
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

/// Simulated content not modeled by any domain entity — see
/// `ChatDisplay` and the feature README for why each exists.
const bool mockChatIsOnline = true;

const String mockChatLastSeen = 'Activo hace 2 min';

const bool mockChatIsTyping = false;
