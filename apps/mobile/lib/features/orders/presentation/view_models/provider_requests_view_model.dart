import '../../../../core/network/http_exceptions.dart';
import '../../../../core/presentation/cancellable_view_model.dart';
import '../../../../order/entities/order.dart';
import '../../../../order/models/order_status.dart';
import '../../../../provider/entities/provider.dart';
import '../../../../quote/models/quote_type.dart';
import '../../../../review/entities/review.dart';
import '../../../reviews/repositories/reviews_repository.dart';
import '../../models/provider_request_display.dart';
import '../../repositories/orders_repository.dart';

enum ProviderRequestsLoadStatus { loading, success, error }

/// Owns the async load of the provider's "Servicios" screen against
/// `OrdersRepository.getRelevantOrders()` — every Order already hired
/// to this provider (any status) plus every open request in their own
/// category still unassigned and `Pending` (see
/// `GET /orders/relevant-for-provider` on the real backend). Replaces
/// the previous, unscoped `getOrders()` call that returned literally
/// every order in the system before filtering to `pending` client-side
/// — a real bug (a plumber's dashboard showed electricians' requests
/// too).
///
/// There is no more `accept`: a provider's actionable response to a
/// `Pending` request is [submitQuote], not accepting the `Order`
/// directly (the client accepting that `Quote` is what advances the
/// `Order` to `Accepted` — not modeled here, see `QuoteRepository`).
/// [start]/[complete] drive the rest of the lifecycle
/// (`Accepted -> InProgress -> Completed`). Every mutating method
/// reloads the full list afterwards rather than patching local state,
/// so the provider always sees the same "next relevant order" section
/// the real backend would return on any other refresh.
class ProviderRequestsViewModel extends CancellableViewModel {
  ProviderRequestsViewModel(this._repository, {required ReviewsRepository reviewsRepository})
    : _reviewsRepository = reviewsRepository;

  final OrdersRepository _repository;
  final ReviewsRepository _reviewsRepository;

  ProviderRequestsLoadStatus _status = ProviderRequestsLoadStatus.loading;
  List<ProviderRequestDisplay> _requests = const [];
  String? _errorMessage;
  Provider? _provider;

  ProviderRequestsLoadStatus get status => _status;
  List<ProviderRequestDisplay> get requests => _requests;
  String? get errorMessage => _errorMessage;

  /// Still-actionable requests: `Pending` (needs a quote),
  /// `Accepted` (needs to be started) or `InProgress` (needs to be
  /// completed).
  List<ProviderRequestDisplay> get activeRequests => _requests
      .where(
        (request) =>
            request.status == OrderStatus.pending ||
            request.status == OrderStatus.accepted ||
            request.status == OrderStatus.inProgress,
      )
      .toList();

  /// Everything else — `Completed`/`Cancelled`/`Rejected` — nothing
  /// left to do, shown as read-only history.
  List<ProviderRequestDisplay> get historyRequests => _requests
      .where(
        (request) =>
            request.status == OrderStatus.completed ||
            request.status == OrderStatus.cancelled ||
            request.status == OrderStatus.rejected,
      )
      .toList();

  Future<void> load() async {
    _status = ProviderRequestsLoadStatus.loading;
    notifySafely();
    try {
      _provider = await _repository.getCurrentProvider();
      final orders = await _repository.getRelevantOrders();
      final reviews = await _reviewsRepository.getReviews(
        cancelToken: cancelToken,
      );
      _requests = await Future.wait(
        orders.map((order) => _buildDisplay(order, reviews)),
      );
      _status = ProviderRequestsLoadStatus.success;
    } on HttpException catch (exception) {
      if (exception is CancelledHttpException) return;
      _errorMessage = exception.message;
      _status = ProviderRequestsLoadStatus.error;
    } catch (_) {
      _errorMessage = 'Ocurrió un problema inesperado. Intenta de nuevo.';
      _status = ProviderRequestsLoadStatus.error;
    }
    notifySafely();
  }

  Future<ProviderRequestDisplay> _buildDisplay(
    Order order,
    List<Review> reviews,
  ) async {
    final category = await _repository.getCategoryFor(
      order,
      cancelToken: cancelToken,
    );
    final clientProfile = await _repository.getClientProfileFor(order);
    final service = order.isDirectHire
        ? await _repository.getServiceFor(order, cancelToken: cancelToken)
        : null;
    final provider = _provider;
    final myQuote = provider == null
        ? null
        : await _repository.getMyQuoteFor(order, provider);
    final hasReviewed = reviews.any((review) => review.orderId == order.id);
    return ProviderRequestDisplay(
      order: order,
      category: category,
      clientProfile: clientProfile,
      service: service,
      myQuote: myQuote,
      hasReviewed: hasReviewed,
    );
  }

  Future<void> submitQuote(
    ProviderRequestDisplay request, {
    required num proposedPrice,
    required int estimatedDuration,
    required String notes,
    QuoteType type = QuoteType.standard,
  }) async {
    final provider = _provider ?? await _repository.getCurrentProvider();
    await _repository.submitQuote(
      order: request.order,
      provider: provider,
      proposedPrice: proposedPrice,
      estimatedDuration: estimatedDuration,
      notes: notes,
      type: type,
    );
    await load();
  }

  Future<void> start(ProviderRequestDisplay request) async {
    await _repository.startOrder(request.order);
    await load();
  }

  Future<void> complete(ProviderRequestDisplay request) async {
    await _repository.completeOrder(request.order);
    await load();
  }

  Future<void> reject(ProviderRequestDisplay request) async {
    await _repository.rejectOrder(request.order);
    await load();
  }

  Future<void> retry() => load();
}
