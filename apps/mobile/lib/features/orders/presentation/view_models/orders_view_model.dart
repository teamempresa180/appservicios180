import '../../../../core/network/http_exceptions.dart';
import '../../../../core/presentation/cancellable_view_model.dart';
import '../../../../order/entities/order.dart';
import '../../../../order/journey/order_journey_info.dart';
import '../../../../order/journey/order_journey_stage.dart';
import '../../../../order/models/order_id.dart';
import '../../../quote/repositories/quote_repository.dart';
import '../../../reviews/repositories/reviews_repository.dart';
import '../../models/order_display.dart';
import '../../repositories/orders_repository.dart';
import '../../services/order_display_loader.dart';
import '../../services/order_journey_loader.dart';

enum OrdersLoadStatus { loading, success, error }

/// Neutral fallback shown only if [OrdersViewModel.journeyFor] is ever
/// asked about an order it didn't just load alongside (shouldn't
/// happen in practice — every order from [OrdersRepository.getOrders]
/// gets its journey built in the same [load] call) — safer than a
/// crash if that invariant is ever violated.
const _fallbackJourney = OrderJourneyInfo(
  stage: OrderJourneyStage.requested,
  title: '',
  description: '',
  helpMessage: '',
  actions: [],
);

/// Owns the async load of [OrdersPage]'s data against the real
/// [OrdersRepository] (resolved via DI, see
/// `core/di/service_locator.dart`). Replaces the previous
/// build-time-only `_buildOrders()` now that every repository method
/// is a `Future` — a real network call needs a real
/// Loading/Success/Error state, not a fixed `state` toggle.
///
/// Also derives each order's [OrderJourneyInfo] (see
/// `order/journey/client_order_journey.dart`) alongside its
/// `OrderDisplay` — the single source of truth `OrderCard` renders its
/// timeline/copy/action buttons from, via [journeyFor]. That derivation
/// needs each order's `Quote`s and whether the client already reviewed
/// it, hence the two extra repositories.
class OrdersViewModel extends CancellableViewModel {
  OrdersViewModel(
    this._repository, {
    required QuoteRepository quoteRepository,
    required ReviewsRepository reviewsRepository,
  }) : _quoteRepository = quoteRepository,
       _reviewsRepository = reviewsRepository;

  final OrdersRepository _repository;
  final QuoteRepository _quoteRepository;
  final ReviewsRepository _reviewsRepository;

  OrdersLoadStatus _status = OrdersLoadStatus.loading;
  List<OrderDisplay> _orders = const [];
  Map<OrderId, OrderJourneyInfo> _journeyByOrderId = const {};
  String? _errorMessage;

  OrdersLoadStatus get status => _status;
  List<OrderDisplay> get orders => _orders;
  String? get errorMessage => _errorMessage;

  /// The derived journey for [order] — see the class doc. Falls back to
  /// a blank, action-less journey if [order] wasn't part of the last
  /// [load] (shouldn't happen; see [_fallbackJourney]).
  OrderJourneyInfo journeyFor(Order order) =>
      _journeyByOrderId[order.id] ?? _fallbackJourney;

  Future<void> load() async {
    _status = OrdersLoadStatus.loading;
    notifySafely();
    try {
      final orders = await _repository.getOrders(cancelToken: cancelToken);
      _orders = await Future.wait(
        orders.map(
          (order) => OrderDisplayLoader.load(
            order,
            _repository,
            cancelToken: cancelToken,
          ),
        ),
      );

      final reviews = await _reviewsRepository.getReviews(
        cancelToken: cancelToken,
      );
      final journeys = await Future.wait(
        orders.map(
          (order) => OrderJourneyLoader.load(
            order: order,
            quoteRepository: _quoteRepository,
            reviews: reviews,
            cancelToken: cancelToken,
          ),
        ),
      );
      _journeyByOrderId = {
        for (var i = 0; i < orders.length; i++) orders[i].id: journeys[i],
      };

      _status = OrdersLoadStatus.success;
    } on HttpException catch (exception) {
      if (exception is CancelledHttpException) return;
      _errorMessage = exception.message;
      _status = OrdersLoadStatus.error;
    } catch (_) {
      _errorMessage = 'Ocurrió un problema inesperado. Intenta de nuevo.';
      _status = OrdersLoadStatus.error;
    }
    notifySafely();
  }

  Future<void> retry() => load();
}
