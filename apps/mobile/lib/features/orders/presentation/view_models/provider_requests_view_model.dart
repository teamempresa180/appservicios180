import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../order/entities/order.dart';
import '../../../../order/models/order_status.dart';
import '../../models/provider_request_display.dart';
import '../../repositories/orders_repository.dart';

enum ProviderRequestsLoadStatus { loading, success, error }

/// Owns the async load of the provider's "Servicios" screen: every
/// [Order] still in [OrderStatus.pending] (an incoming client request
/// the provider hasn't accepted or rejected yet), same Loading/
/// Success/Error pattern as `OrdersViewModel`. [accept]/[reject] then
/// remove the request from [requests] on success — see
/// `HttpOrdersRepository.acceptOrder`'s doc comment for why that removal
/// is client-side-only against the real backend today.
class ProviderRequestsViewModel extends ChangeNotifier {
  ProviderRequestsViewModel(this._repository);

  final OrdersRepository _repository;

  ProviderRequestsLoadStatus _status = ProviderRequestsLoadStatus.loading;
  List<ProviderRequestDisplay> _requests = const [];
  String? _errorMessage;

  ProviderRequestsLoadStatus get status => _status;
  List<ProviderRequestDisplay> get requests => _requests;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = ProviderRequestsLoadStatus.loading;
    notifyListeners();
    try {
      final orders = await _repository.getOrders();
      final pending = orders.where(
        (order) => order.status == OrderStatus.pending,
      );
      _requests = await Future.wait(pending.map(_buildDisplay));
      _status = ProviderRequestsLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = ProviderRequestsLoadStatus.error;
    }
    notifyListeners();
  }

  Future<ProviderRequestDisplay> _buildDisplay(Order order) async {
    final service = await _repository.getServiceFor(order);
    final category = await _repository.getCategoryFor(order);
    final quote = await _repository.getQuoteFor(order);
    final clientProfile = await _repository.getClientProfileFor(order);
    return ProviderRequestDisplay(
      order: order,
      service: service,
      category: category,
      quote: quote,
      clientProfile: clientProfile,
    );
  }

  Future<void> accept(ProviderRequestDisplay request) async {
    await _repository.acceptOrder(request.order);
    _requests = _requests.where((r) => r.order.id != request.order.id).toList();
    notifyListeners();
  }

  Future<void> reject(ProviderRequestDisplay request) async {
    await _repository.rejectOrder(request.order);
    _requests = _requests.where((r) => r.order.id != request.order.id).toList();
    notifyListeners();
  }

  Future<void> retry() => load();
}
