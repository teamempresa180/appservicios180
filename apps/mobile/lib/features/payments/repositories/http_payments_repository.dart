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
/// The feature interface still models a single fixed payment (see
/// `payments_repository.dart`'s own doc comment: "no id-based lookup
/// yet"). `_fetchPayment()` takes the first item of `GET /payments`
/// (paginated, unfiltered) as that one payment — the same interim
/// shape as `HttpChatRepository._fetchChat()`/`HttpQuoteRepository`.
///
/// Every other getter chains through an id already carried by
/// [Payment] itself (`orderId`, `quoteId`, `receiverProviderId`) via
/// `GET /{resource}/:id`, same style as `HttpOrdersRepository`.
/// [getService] goes through the order's `serviceId` (`Payment` has no
/// `serviceId` of its own) and [getProfile] goes through the
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
  Future<Quote> getQuote() async {
    final payment = await _fetchPayment();
    final json = await _apiClient.get('/quotes/${payment.quoteId.value}');
    return QuoteHttpMapper.fromJson(json);
  }

  @override
  Future<Service> getService() async {
    final order = await getOrder();
    final json = await _apiClient.get('/services/${order.serviceId.value}');
    return ServiceHttpMapper.fromJson(json);
  }

  @override
  Future<Provider> getProvider() async {
    final payment = await _fetchPayment();
    final json = await _apiClient.get(
      '/providers/${payment.receiverProviderId.value}',
    );
    return ProviderHttpMapper.fromJson(json);
  }

  @override
  Future<Profile> getProfile() async {
    final provider = await getProvider();
    final json = await _apiClient.get(
      '/profiles/${provider.providerProfileId.value}',
    );
    return ProfileHttpMapper.fromJson(json);
  }
}
