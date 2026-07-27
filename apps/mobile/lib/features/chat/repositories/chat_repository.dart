import '../../../attachment/entities/attachment.dart';
import '../../../chat/entities/chat.dart';
import '../../../message/entities/message.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../models/conversation_summary.dart';

/// Contract for reading the domain entities the Chat screen needs.
/// Returns only real domain entities — no `Map`, no `dynamic`, no JSON.
/// Implemented today by `HttpChatRepository` (real backend) and
/// `MockChatRepository` (kept for tests/offline fallback, see the
/// feature README).
///
/// There is no id-based lookup yet for [getChat]/[getMessages]/etc — this
/// feature shows a single fixed conversation (see the feature README for
/// why). [getConversations] is the one exception: it powers the
/// "Mensajes" list (multiple conversations), independent of that
/// limitation.
abstract class ChatRepository {
  Future<Chat> getChat();
  Future<Provider> getProvider();
  Future<Profile> getProfile();
  Future<Order> getOrder();
  Future<List<Message>> getMessages();
  Future<List<Attachment>> getAttachments();

  /// One row per conversation, newest first — backs the "Mensajes" tab.
  Future<List<ConversationSummary>> getConversations();
}
