import '../../../attachment/entities/attachment.dart';
import '../../../chat/entities/chat.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../message/entities/message.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
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
  HttpChatRepository(this._apiClient);

  final ApiClient _apiClient;

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
}
