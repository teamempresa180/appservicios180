import '../../../attachment/entities/attachment.dart';
import '../../../chat/entities/chat.dart';
import '../../../message/entities/message.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../mock/mock_chat_data.dart';
import '../models/conversation_summary.dart';
import 'chat_repository.dart';

/// In-memory `ChatRepository` backed by fixed mock data. No backend,
/// no sockets, no Firebase, no HTTP — see the feature README.
class MockChatRepository implements ChatRepository {
  @override
  Future<Chat> getChat() => Future.value(mockChat);

  @override
  Future<Provider> getProvider() => Future.value(mockChatProvider);

  @override
  Future<Profile> getProfile() => Future.value(mockChatProfile);

  @override
  Future<Order> getOrder() => Future.value(mockChatOrder);

  @override
  Future<List<Message>> getMessages() =>
      Future.value(List.unmodifiable(mockChatMessages));

  @override
  Future<List<Attachment>> getAttachments() =>
      Future.value(List.unmodifiable(mockChatAttachments));

  @override
  Future<List<ConversationSummary>> getConversations() =>
      Future.value(List.unmodifiable(mockConversations));
}
