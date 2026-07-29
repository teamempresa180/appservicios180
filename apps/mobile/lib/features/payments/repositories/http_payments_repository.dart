import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';
import 'payments_repository.dart';

/// [PaymentsRepository] backed by [ApiClient].
///
/// [getPayment]/[getOrder] have no id parameter (only `GET /payments`,
/// paginated, unfiltered) — `_fetchPayment()` takes the first item as a
/// fallback for when the caller doesn't already have an [Order] in
/// hand. The normal path skips it: [getPaymentFor] lists `GET /payments`
/// and filters by `orderId` client-side (no `GET /payments?orderId=`
/// filter exists yet — same interim shape as
/// `HttpChatRepository.getMessages`), then every other getter chains
/// through an id already carried by [Payment]/[Order] (`quoteId`,
/// `receiverProviderId`, `serviceId`) via `GET /{resource}/:id`, same
/// style as `HttpOrdersRepository`. [getProfileFor] goes through the
/// provider's `providerProfileId`.
class HttpPaymentsRepository implements PaymentsRepository {
  HttpPaymentsRepository(this._apiClient);

  final ApiClient _apiClient;

  Future<Payment> _fetchPayment() async {
    final json = await _apiClient.get('/payments');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    if (items.isEmpty) {
      throw StateError('No payments available for the current session');
    }
    return PaymentHttpMapper.fromJson(items.first);
  }

  @override
  Future<Payment> getPayment() => _fetchPayment();

  @override
  Future<Order> getOrder() async {
    final payment = await _fetchPayment();
    final json = await _apiClient.get('/orders/${payment.orderId.value}');
    return OrderHttpMapper.fromJson(json);
  }

  @override
  Future<Payment> getPaymentFor(Order order) async {
    final json = await _apiClient.get('/payments');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final match = items.firstWhere(
      (item) => item['orderId'] == order.id.value,
      orElse: () => throw StateError(
        'No payment found for order ${order.id.value}',
      ),
    );
    return PaymentHttpMapper.fromJson(match);
  }

  @override
  Future<Quote> getQuoteFor(Payment payment) async {
    final json = await _apiClient.get('/quotes/${payment.quoteId.value}');
    return QuoteHttpMapper.fromJson(json);
  }

  @override
  Future<Service> getServiceFor(Order order) async {
    // Payments only exist for orders whose Quote was already accepted —
    // a direct-hire order (serviceId set at creation), so `!` is safe
    // here. Open-request orders have no serviceId and never reach
    // Payments in the current flow.
    final json = await _apiClient.get('/services/${order.serviceId!.value}');
    return ServiceHttpMapper.fromJson(json);
  }

  @override
  Future<Provider> getProviderFor(Payment payment) async {
    final json = await _apiClient.get(
      '/providers/${payment.receiverProviderId.value}',
    );
    return ProviderHttpMapper.fromJson(json);
  }

  @override
  Future<Profile> getProfileFor(Provider provider) async {
    final json = await _apiClient.get(
      '/profiles/${provider.providerProfileId.value}',
    );
    return ProfileHttpMapper.fromJson(json);
  }
}
