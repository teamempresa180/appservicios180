import '../../../chat/entities/chat.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../core/session/session_manager.dart';
import '../../../notification/entities/notification.dart';
import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../quote/entities/quote.dart';
import 'notifications_repository.dart';

/// [NotificationsRepository] backed by [ApiClient].
///
/// `getNotifications()` calls `GET /notifications` (paginated,
/// unfiltered) and matches client-side on `identityId ==
/// sessionManager.currentUserId` — the backend has no
/// `GET /notifications?identityId=` filter yet, same interim shape as
/// `HttpOrdersRepository.getQuoteFor`.
///
/// `Notification` has no foreign key to `Order`/`Payment`/`Quote`/
/// `Chat` at all — not even an interim client-filterable one (see this
/// repository's own interface doc comment). There is nothing to
/// resolve, so every `getXFor` method here returns `Future.value(null)`
/// — matching the interface's own doc comment about there being no
/// real relation, not a network limitation to work around later.
class HttpNotificationsRepository implements NotificationsRepository {
  HttpNotificationsRepository(this._apiClient, this._sessionManager);

  final ApiClient _apiClient;
  final SessionManager _sessionManager;

  @override
  Future<List<Notification>> getNotifications() async {
    final json = await _apiClient.get('/notifications');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final currentUserId = _sessionManager.currentUserId;
    return items
        .where((item) => item['identityId'] == currentUserId)
        .map(NotificationHttpMapper.fromJson)
        .toList();
  }

  @override
  Future<Order?> getOrderFor(Notification notification) => Future.value();

  @override
  Future<Payment?> getPaymentFor(Notification notification) => Future.value();

  @override
  Future<Quote?> getQuoteFor(Notification notification) => Future.value();

  @override
  Future<Chat?> getChatFor(Notification notification) => Future.value();
}
