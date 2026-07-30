import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../order/entities/order.dart';
import '../../mock/mock_payment_data.dart';
import '../../models/payment_display.dart';
import '../../repositories/payments_repository.dart';

enum PaymentsLoadStatus { loading, success, error }

/// Owns the async load of [PaymentsPage]'s data against the real
/// [PaymentsRepository] (backend-backed via DI, see
/// `core/di/service_locator.dart`). Composes the six awaited entities
/// into a [PaymentDisplay] the same way the previous build-time-only
/// `_buildData()` did — [paymentReference]/[receiptNumber] stay
/// simulated (see [PaymentDisplay]'s own doc comment).
///
/// When [presetOrder] is supplied (the normal path — `OrderActions`
/// already has the real [Order] the user tapped), it's used directly
/// instead of falling back to [PaymentsRepository.getOrder]'s single
/// fixed record, so different orders genuinely open their own payment.
class PaymentsViewModel extends ChangeNotifier {
  PaymentsViewModel(this._repository, {Order? presetOrder})
    : _presetOrder = presetOrder;

  final PaymentsRepository _repository;
  final Order? _presetOrder;

  /// Guards every [notifyListeners] call — see
  /// `ProviderDashboardViewModel._disposed`'s doc comment for why.
  bool _disposed = false;

  PaymentsLoadStatus _status = PaymentsLoadStatus.loading;
  PaymentDisplay? _data;
  String? _errorMessage;

  PaymentsLoadStatus get status => _status;
  PaymentDisplay? get data => _data;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = PaymentsLoadStatus.loading;
    if (!_disposed) notifyListeners();
    try {
      final order = _presetOrder ?? await _repository.getOrder();
      final payment = _presetOrder != null
          ? await _repository.getPaymentFor(order)
          : await _repository.getPayment();

      // Every remaining getter takes `order`/`payment` directly, so
      // they can safely run concurrently.
      final quoteFuture = _repository.getQuoteFor(payment);
      final serviceFuture = _repository.getServiceFor(order);
      final providerFuture = _repository.getProviderFor(payment);

      final quote = await quoteFuture;
      final service = await serviceFuture;
      final provider = await providerFuture;
      final profile = await _repository.getProfileFor(provider);
      _data = PaymentDisplay(
        payment: payment,
        order: order,
        quote: quote,
        service: service,
        provider: provider,
        profile: profile,
        paymentReference: mockPaymentReference,
        receiptNumber: mockPaymentReceiptNumber,
      );
      _status = PaymentsLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = PaymentsLoadStatus.error;
    } catch (_) {
      _errorMessage = 'Ocurrió un problema inesperado. Intenta de nuevo.';
      _status = PaymentsLoadStatus.error;
    }
    if (!_disposed) notifyListeners();
  }

  Future<void> retry() => load();

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }
}
