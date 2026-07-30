import 'package:dio/dio.dart';

import '../../../order/models/order_id.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_id.dart';
import '../../../quote/entities/quote.dart';
import '../../../quote/models/quote_id.dart';
import '../../../quote/models/quote_status.dart';
import '../../../quote/models/quote_type.dart';
import '../mock/mock_quote_data.dart';
import 'quote_repository.dart';

/// In-memory `QuoteRepository` backed by fixed mock data. No backend,
/// no persistence, no network — see the feature README.
class MockQuoteRepository implements QuoteRepository {
  final List<Quote> _quotes = List.of(mockQuotes);

  @override
  Future<List<Quote>> getQuotesForOrder(
    OrderId orderId, {
    CancelToken? cancelToken,
  }) => Future.value(
    List.unmodifiable(_quotes.where((quote) => quote.orderId == orderId)),
  );

  @override
  Future<Provider> getProviderFor(Quote quote, {CancelToken? cancelToken}) =>
      Future.value(mockQuoteProvidersById[quote.providerId]!);

  @override
  Future<Profile> getProfileFor(Quote quote, {CancelToken? cancelToken}) =>
      Future.value(mockQuoteProfilesByProviderId[quote.providerId]!);

  @override
  Future<Quote> createQuote({
    required OrderId orderId,
    required ProviderId providerId,
    required num proposedPrice,
    required int estimatedDuration,
    required String notes,
    required QuoteType type,
  }) async {
    final now = DateTime.now();
    final quote = Quote(
      id: QuoteId.create(),
      orderId: orderId,
      providerId: providerId,
      proposedPrice: proposedPrice,
      estimatedDuration: estimatedDuration,
      notes: notes,
      status: QuoteStatus.pending,
      type: type,
      createdAt: now,
      updatedAt: now,
    );
    _quotes.add(quote);
    return quote;
  }

  Quote _replace(Quote quote, QuoteStatus status) {
    final updated = quote.copyWith(status: status);
    final index = _quotes.indexWhere((existing) => existing.id == quote.id);
    if (index != -1) _quotes[index] = updated;
    return updated;
  }

  @override
  Future<Quote> acceptQuote(Quote quote) =>
      Future.value(_replace(quote, QuoteStatus.accepted));

  @override
  Future<Quote> rejectQuote(Quote quote) =>
      Future.value(_replace(quote, QuoteStatus.rejected));
}
