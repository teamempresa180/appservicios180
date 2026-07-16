import '../../../attachment/entities/attachment.dart';
import '../../../chat/entities/chat.dart';
import '../../../message/entities/message.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';

/// Contract for reading the domain entities the Chat screen needs.
/// Returns only real domain entities — no `Map`, no `dynamic`, no JSON.
/// Implemented today by `HttpChatRepository` (real backend) and
/// `MockChatRepository` (kept for tests/offline fallback, see the
/// feature README).
///
/// There is no id-based lookup yet — this feature shows a single fixed
/// conversation (see the feature README for why).
abstract class ChatRepository {
  Future<Chat> getChat();
  Future<Provider> getProvider();
  Future<Profile> getProfile();
  Future<Order> getOrder();
  Future<List<Message>> getMessages();
  Future<List<Attachment>> getAttachments();
}
