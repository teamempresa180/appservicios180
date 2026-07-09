import '../../core/base/entity.dart';
import '../../chat/models/chat_id.dart';
import '../../identity/models/identity_id.dart';
import '../models/message_id.dart';
import '../models/message_type.dart';
import '../models/message_status.dart';

/// Represents an individual message belonging to a Chat.
/// Pure data holder — no real-time transport, no WebSockets, no attachments,
/// no AI, no translation, no moderation, no persistence, no business rules.
class Message extends Entity<MessageId> {
  const Message({
    required MessageId id,
    required this.chatId,
    required this.senderIdentityId,
    required this.content,
    required this.type,
    required this.status,
    required this.sentAt,
    required this.readAt,
  }) : super(id);

  final ChatId chatId;
  final IdentityId senderIdentityId;
  final String content;
  final MessageType type;
  final MessageStatus status;
  final DateTime sentAt;
  final DateTime? readAt;
}
