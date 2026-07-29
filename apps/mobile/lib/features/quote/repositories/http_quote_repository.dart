import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../core/network/mappers/enum_json.dart';
import '../../../order/models/order_id.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_id.dart';
import '../../../quote/entities/quote.dart';
import '../../../quote/models/quote_type.dart';
import 'quote_repository.dart';

/// [QuoteRepository] backed by [ApiClient].
///
/// [getQuotesForOrder] has no server-side `?orderId=` filter (`GET
/// /quotes` is paginated, unfiltered) — lists the full collection and
/// matches `orderId` client-side, same interim shape already documented
/// on `HttpOrdersRepository.getQuoteFor`.
class HttpQuoteRepository implements QuoteRepository {
  HttpQuoteRepository(this._apiClient);

  final ApiClient _apiClient;

  @override
  Future<List<Quote>> getQuotesForOrder(OrderId orderId) async {
    final json = await _apiClient.get('/quotes');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final quotes = items
        .where((item) => item['orderId'] == orderId.value)
        .map(QuoteHttpMapper.fromJson)
        .toList();
    quotes.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return quotes;
  }

  @override
  Future<Provider> getProviderFor(Quote quote) async {
    final json = await _apiClient.get('/providers/${quote.providerId.value}');
    return ProviderHttpMapper.fromJson(json);
  }

  @override
  Future<Profile> getProfileFor(Quote quote) async {
    final provider = await getProviderFor(quote);
    final json = await _apiClient.get(
      '/profiles/${provider.providerProfileId.value}',
    );
    return ProfileHttpMapper.fromJson(json);
  }

  @override
  Future<Quote> createQuote({
    required OrderId orderId,
    required ProviderId providerId,
    required num proposedPrice,
    required int estimatedDuration,
    required String notes,
    required QuoteType type,
  }) async {
    final json = await _apiClient.post(
      '/quotes',
      data: {
        'orderId': orderId.value,
        'providerId': providerId.value,
        'proposedPrice': proposedPrice,
        'estimatedDuration': estimatedDuration,
        'notes': notes,
        'type': enumToJson(type.name),
      },
    );
    return QuoteHttpMapper.fromJson(json);
  }

  @override
  Future<Quote> acceptQuote(Quote quote) async {
    final json = await _apiClient.put('/quotes/${quote.id.value}/accept');
    return QuoteHttpMapper.fromJson(json);
  }

  @override
  Future<Quote> rejectQuote(Quote quote) async {
    final json = await _apiClient.put('/quotes/${quote.id.value}/reject');
    return QuoteHttpMapper.fromJson(json);
  }
}
