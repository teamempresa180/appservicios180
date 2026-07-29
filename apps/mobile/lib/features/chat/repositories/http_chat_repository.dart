import '../../../attachment/entities/attachment.dart';
import '../../../chat/entities/chat.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../core/network/mappers/enum_json.dart';
import '../../../core/session/session_manager.dart';
import '../../../message/entities/message.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_id.dart';
import '../models/conversation_summary.dart';
import 'chat_repository.dart';

/// [ChatRepository] backed by [ApiClient].
///
/// The feature interface still models a single fixed conversation (see
/// `chat_repository.dart`'s own doc comment: "no id-based lookup yet").
/// The backend mirrors that limitation — there is no "chat for the
/// current user" endpoint, only `GET /chats` (paginated, unfiltered)
/// and `GET /chats/:id`. [getChat] takes the first item of the list as
/// the one conversation this screen shows, exactly matching what the
/// previous mock data represented (a single fixed chat) — just sourced
/// from the real backend now instead of a hardcoded object.
///
/// [getMessages] and [getAttachments] have the same interim shape as
/// `HttpOrdersRepository.getQuoteFor`: the backend has no
/// `GET /messages?chatId=` or `GET /attachments?messageId=` filter, so
/// both list the full unfiltered collection and match client-side.
/// Adding those query filters is the natural Prompt 76 follow-up.
class HttpChatRepository implements ChatRepository {
  HttpChatRepository(this._apiClient, this._sessionManager);

  final ApiClient _apiClient;
  final SessionManager _sessionManager;

  Future<Chat> _fetchChat() async {
    final json = await _apiClient.get('/chats');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    if (items.isEmpty) {
      throw StateError('No chats available for the current session');
    }
    return ChatHttpMapper.fromJson(items.first);
  }

  @override
  Future<Chat> getChat() => _fetchChat();

  @override
  Future<Provider> getProvider() async {
    final chat = await _fetchChat();
    final json = await _apiClient.get('/providers/${chat.providerId.value}');
    return ProviderHttpMapper.fromJson(json);
  }

  @override
  Future<Profile> getProfile() async {
    final chat = await _fetchChat();
    final json = await _apiClient.get('/profiles');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final match = items.firstWhere(
      (item) => item['identityId'] == chat.clientIdentityId.value,
      orElse: () => throw StateError(
        'No profile found for identity ${chat.clientIdentityId.value}',
      ),
    );
    return ProfileHttpMapper.fromJson(match);
  }

  @override
  Future<Order> getOrder() async {
    final chat = await _fetchChat();
    final json = await _apiClient.get('/orders/${chat.orderId.value}');
    return OrderHttpMapper.fromJson(json);
  }

  @override
  Future<List<Message>> getMessages() async {
    final chat = await _fetchChat();
    final json = await _apiClient.get('/messages');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .where((item) => item['chatId'] == chat.id.value)
        .map(MessageHttpMapper.fromJson)
        .toList();
  }

  @override
  Future<List<Attachment>> getAttachments() async {
    final messages = await getMessages();
    final messageIds = messages.map((message) => message.id.value).toSet();
    final json = await _apiClient.get('/attachments');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .where((item) => messageIds.contains(item['messageId']))
        .map(AttachmentHttpMapper.fromJson)
        .toList();
  }

  /// Builds one [ConversationSummary] per Chat the backend returns,
  /// each with its own N+1 lookup (bounded by however many chats the
  /// current session has — the same trade-off the rest of this
  /// repository already accepts for a single chat, just repeated per
  /// row). The provider's display name comes from its Profile; if
  /// either lookup fails for a given chat, that chat is skipped rather
  /// than surfacing a broken row.
  @override
  Future<List<ConversationSummary>> getConversations() async {
    final chatsJson = await _apiClient.get('/chats');
    final chatItems = (chatsJson['items'] as List<dynamic>)
        .cast<Map<String, dynamic>>();
    final messagesJson = await _apiClient.get('/messages');
    final messageItems = (messagesJson['items'] as List<dynamic>)
        .cast<Map<String, dynamic>>();
    final allMessages = messageItems.map(MessageHttpMapper.fromJson).toList();
    final currentUserId = _sessionManager.currentUserId;

    final summaries = <ConversationSummary>[];
    for (final chatJson in chatItems) {
      final chat = ChatHttpMapper.fromJson(chatJson);
      final chatMessages =
          allMessages.where((message) => message.chatId == chat.id).toList()
            ..sort((a, b) => a.sentAt.compareTo(b.sentAt));
      if (chatMessages.isEmpty) continue;

      final last = chatMessages.last;
      final unreadCount = chatMessages
          .where(
            (message) =>
                message.readAt == null &&
                message.senderIdentityId.value != currentUserId,
          )
          .length;

      String counterpartName;
      try {
        final providerJson = await _apiClient.get(
          '/providers/${chat.providerId.value}',
        );
        final provider = ProviderHttpMapper.fromJson(providerJson);
        final profileJson = await _apiClient.get(
          '/profiles/${provider.providerProfileId.value}',
        );
        counterpartName = ProfileHttpMapper.fromJson(profileJson).displayName;
      } catch (_) {
        continue;
      }

      summaries.add(
        ConversationSummary(
          chatId: chat.id,
          counterpartName: counterpartName,
          lastMessagePreview: last.content,
          lastMessageAt: last.sentAt,
          unreadCount: unreadCount,
          isUnanswered:
              last.senderIdentityId.value != currentUserId && unreadCount > 0,
        ),
      );
    }
    summaries.sort((a, b) => b.lastMessageAt.compareTo(a.lastMessageAt));
    return summaries;
  }

  @override
  Future<Chat> createOrGetForOrder(Order order, ProviderId providerId) async {
    final json = await _apiClient.get('/chats');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final match = items.where((item) => item['orderId'] == order.id.value);
    if (match.isNotEmpty) return ChatHttpMapper.fromJson(match.first);

    final created = await _apiClient.post(
      '/chats',
      data: {
        'orderId': order.id.value,
        'clientIdentityId': order.identityId.value,
        'providerId': providerId.value,
        'type': enumToJson('orderRelated'),
      },
    );
    return ChatHttpMapper.fromJson(created);
  }
}
