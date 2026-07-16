import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../order/entities/order.dart';
import '../../mock/mock_orders_data.dart';
import '../../models/order_display.dart';
import '../../repositories/orders_repository.dart';

enum OrdersLoadStatus { loading, success, error }

/// Owns the async load of [OrdersPage]'s data against the real
/// [OrdersRepository] (resolved via DI, see
/// `core/di/service_locator.dart`). Replaces the previous
/// build-time-only `_buildOrders()` now that every repository method
/// is a `Future` — a real network call needs a real
/// Loading/Success/Error state, not a fixed `state` toggle.
class OrdersViewModel extends ChangeNotifier {
  OrdersViewModel(this._repository);

  final OrdersRepository _repository;

  OrdersLoadStatus _status = OrdersLoadStatus.loading;
  List<OrderDisplay> _orders = const [];
  String? _errorMessage;

  OrdersLoadStatus get status => _status;
  List<OrderDisplay> get orders => _orders;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = OrdersLoadStatus.loading;
    notifyListeners();
    try {
      final orders = await _repository.getOrders();
      _orders = await Future.wait(orders.map(_buildDisplay));
      _status = OrdersLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = OrdersLoadStatus.error;
    }
    notifyListeners();
  }

  Future<OrderDisplay> _buildDisplay(Order order) async {
    final service = await _repository.getServiceFor(order);
    final provider = await _repository.getProviderFor(order);
    final profile = await _repository.getProfileFor(order);
    final category = await _repository.getCategoryFor(order);
    final quote = await _repository.getQuoteFor(order);
    return OrderDisplay(
      order: order,
      service: service,
      provider: provider,
      profile: profile,
      category: category,
      quote: quote,
      estimatedArrival: mockOrderEstimatedArrival[order.id] ?? '—',
    );
  }

  Future<void> retry() => load();
}
