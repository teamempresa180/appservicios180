import '../../../attachment/entities/attachment.dart';
import '../../../chat/entities/chat.dart';
import '../../../message/entities/message.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_id.dart';
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

  /// Finds the existing `Chat` for [order] or creates one
  /// (`POST /chats { orderId, clientIdentityId, providerId }` on the
  /// real backend) — the moment a `Quote` is accepted and the client
  /// should be taken straight into a conversation with that provider.
  /// [providerId] is the provider whose `Quote` was just accepted
  /// (needed for open requests, where `order.providerId` may not have
  /// propagated into the caller's in-memory `Order` yet).
  Future<Chat> createOrGetForOrder(Order order, ProviderId providerId);

  /// Sends [content] as a new `Message` in the current fixed
  /// conversation (`POST /messages` on the real backend — chatId and
  /// senderIdentityId are both resolved internally, matching every
  /// other id-implicit method on this interface). Returns the created
  /// `Message` so the caller can append it to the visible list without
  /// a full reload.
  Future<Message> sendMessage(String content);
}
