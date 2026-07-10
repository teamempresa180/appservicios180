import '../../../chat/entities/chat.dart';
import '../../../message/entities/message.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';

/// Contract for reading the domain entities the Chat screen needs.
/// Returns only real domain entities — no `Map`, no `dynamic`, no JSON.
/// Implemented today by `MockChatRepository`; a future
/// `ApiChatRepository` or `FirebaseChatRepository` would implement this
/// same interface (see the feature README).
///
/// There is no id-based lookup yet — this feature shows a single fixed
/// conversation (see the feature README for why).
abstract class ChatRepository {
  Chat getChat();
  Provider getProvider();
  Profile getProfile();
  Order getOrder();
  List<Message> getMessages();
}
