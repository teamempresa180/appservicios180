import '../../../category/entities/category.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../quote/models/quote_type.dart';
import '../../../service/entities/service.dart';

/// Contract for reading the domain entities the Orders screen needs.
/// Returns only real domain entities — no `Map`, no `dynamic`, no JSON.
/// Implemented today by `HttpOrdersRepository` (real backend) and
/// `MockOrdersRepository` (kept for tests/offline fallback, see the
/// feature README).
///
/// Signatures are kept unchanged from before the Order model gained
/// nullable `providerId`/`serviceId` (see `Order`'s own doc comment) so
/// the client-facing Orders screen (`OrdersViewModel`) keeps compiling
/// against this same interface. [getServiceFor]/[getProviderFor]/
/// [getQuoteFor] now throw `StateError` (same style as every other
/// "not found" case already in this codebase, e.g.
/// `HttpOrdersRepository.getQuoteFor`'s previous doc comment) when
/// [order] is an **open request** with nothing assigned yet, or a
/// `Pending` order with no `Quote` yet. Client-side callers that need
/// to tolerate that (this feature's own `OrdersViewModel`) catch it and
/// degrade to a "waiting" display instead of surfacing an error state.
///
/// The methods from [getRelevantOrders] down back the **provider**-
/// facing "Servicios" screen (`ProviderRequestsViewModel`) instead —
/// there is no more `acceptOrder`: a provider's actionable response to
/// a request is submitting a `Quote` ([submitQuote]), not accepting the
/// `Order` directly (see `GET /orders/relevant-for-provider` on the
/// real backend).
abstract class OrdersRepository {
  Future<List<Order>> getOrders();
  Future<Category> getCategoryFor(Order order);
  Future<Service> getServiceFor(Order order);
  Future<Provider> getProviderFor(Order order);
  Future<Profile> getProfileFor(Order order);
  Future<Quote> getQuoteFor(Order order);

  /// The client who placed [order] — distinct from [getProfileFor],
  /// which returns the *provider's* profile. Backs the provider-facing
  /// "Servicios" screen (incoming requests), which needs to show who is
  /// asking.
  Future<Profile> getClientProfileFor(Order order);

  Future<Order> rejectOrder(Order order);

  /// Cancels [order] — always allowed for the client, regardless of
  /// status (`PUT /orders/:id/cancel` on the real backend).
  Future<Order> cancelOrder(Order order);

  /// Every Order relevant to the calling **provider** — every Order
  /// already directly hired to them (any status — this doubles as
  /// their order history) plus every still-`Pending`, unassigned open
  /// request whose category matches their own. Backs the provider's
  /// "Servicios" screen (`ProviderRequestsViewModel`), replacing the
  /// old, unscoped `getOrders()` call that returned literally every
  /// order in the system. See `GET /orders/relevant-for-provider` on
  /// the real backend — it resolves the calling identity's Provider
  /// record server-side, so no id/query param is needed here.
  Future<List<Order>> getRelevantOrders();

  /// The Provider record for the currently authenticated session —
  /// needed to attribute a submitted Quote to the right provider (see
  /// [submitQuote]) and to check whether this provider has already
  /// quoted a given order (see [getMyQuoteFor]).
  Future<Provider> getCurrentProvider();

  /// This [provider]'s own Quote for [order], if they've already
  /// submitted one — `null` when they haven't yet (so the UI can tell
  /// "waiting on my quote" apart from "I haven't quoted this yet").
  Future<Quote?> getMyQuoteFor(Order order, Provider provider);

  /// Submits a new Quote for [order] on behalf of [provider] — the
  /// provider's actionable response to a `Pending` request (direct
  /// hire or open). The client accepting it is what advances [order]
  /// from `Pending` to `Accepted` (not modeled by this repository —
  /// see `QuoteRepository`, owned by a different pass).
  Future<Quote> submitQuote({
    required Order order,
    required Provider provider,
    required num proposedPrice,
    required int estimatedDuration,
    required String notes,
    required QuoteType type,
  });

  /// Moves an `Accepted` order to `InProgress`
  /// (`PUT /orders/:id/start` on the real backend). The backend
  /// returns 422 if [order] isn't currently `Accepted`.
  Future<Order> startOrder(Order order);

  /// Moves an `InProgress` order to `Completed`
  /// (`PUT /orders/:id/complete` on the real backend). The backend
  /// returns 422 if [order] isn't currently `InProgress`.
  Future<Order> completeOrder(Order order);
}
