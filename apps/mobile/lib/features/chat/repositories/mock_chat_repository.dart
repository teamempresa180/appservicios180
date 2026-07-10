import '../../../chat/entities/chat.dart';
import '../../../message/entities/message.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../mock/mock_chat_data.dart';
import 'chat_repository.dart';

/// In-memory `ChatRepository` backed by fixed mock data. No backend,
/// no sockets, no Firebase, no HTTP — see the feature README.
class MockChatRepository implements ChatRepository {
  @override
  Chat getChat() => mockChat;

  @override
  Provider getProvider() => mockChatProvider;

  @override
  Profile getProfile() => mockChatProfile;

  @override
  Order getOrder() => mockChatOrder;

  @override
  List<Message> getMessages() => List.unmodifiable(mockChatMessages);
}
