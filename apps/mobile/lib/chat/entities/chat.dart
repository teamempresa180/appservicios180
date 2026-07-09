import '../../core/base/entity.dart';
import '../../order/models/order_id.dart';
import '../../identity/models/identity_id.dart';
import '../../provider/models/provider_id.dart';
import '../models/chat_id.dart';
import '../models/chat_status.dart';
import '../models/chat_type.dart';

/// Represents a conversation between a client and a provider tied to an
/// order. Pure data holder — no messages, no attachments, no real-time
/// transport, no AI, no persistence, no business rules.
class Chat extends Entity<ChatId> {
  const Chat({
    required ChatId id,
    required this.orderId,
    required this.clientIdentityId,
    required this.providerId,
    required this.status,
    required this.type,
    required this.createdAt,
    required this.updatedAt,
  }) : super(id);

  final OrderId orderId;
  final IdentityId clientIdentityId;
  final ProviderId providerId;
  final ChatStatus status;
  final ChatType type;
  final DateTime createdAt;
  final DateTime updatedAt;
}
