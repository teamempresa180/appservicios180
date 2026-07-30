import 'package:dio/dio.dart';

import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../quote/models/quote_type.dart';
import '../../../order/models/order_id.dart';
import '../../../provider/models/provider_id.dart';

/// Contract for reading/writing the `Quote`s that belong to a single
/// `Order` — an order-scoped, multi-quote-aware replacement of this
/// feature's previous "one single fixed quote" shape (see the feature
/// README for that history). An `Order.orderId` can now receive
/// **several** `Quote`s from different providers (open request), so
/// this screen shows a real list, not one fixed record.
///
/// Implemented today by `MockQuoteRepository` and `HttpQuoteRepository`
/// (real backend).
abstract class QuoteRepository {
  /// Every `Quote` submitted for [orderId], newest first.
  ///
  /// [cancelToken] lets a caller (typically a
  /// `CancellableViewModel`-based view model — see
  /// `core/presentation/cancellable_view_model.dart`) abort this
  /// request if it's torn down before the response arrives. Optional
  /// and `null` by default so existing call sites keep compiling
  /// unchanged.
  Future<List<Quote>> getQuotesForOrder(OrderId orderId, {CancelToken? cancelToken});

  Future<Provider> getProviderFor(Quote quote, {CancelToken? cancelToken});
  Future<Profile> getProfileFor(Quote quote, {CancelToken? cancelToken});

  /// Submits a new `Quote` a provider offers for an order — used by the
  /// provider-side flow (out of scope for this pass, kept here so the
  /// interface matches the real `POST /quotes` contract completely).
  Future<Quote> createQuote({
    required OrderId orderId,
    required ProviderId providerId,
    required num proposedPrice,
    required int estimatedDuration,
    required String notes,
    required QuoteType type,
  });

  /// Accepts [quote] — on the real backend this also cascades the
  /// linked `Order` from `Pending` to `Accepted`, assigning its
  /// `providerId` if it was an open request (see `Order`'s own doc
  /// comment).
  Future<Quote> acceptQuote(Quote quote);
  Future<Quote> rejectQuote(Quote quote);
}
