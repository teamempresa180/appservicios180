import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
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
class PaymentsViewModel extends ChangeNotifier {
  PaymentsViewModel(this._repository);

  final PaymentsRepository _repository;

  PaymentsLoadStatus _status = PaymentsLoadStatus.loading;
  PaymentDisplay? _data;
  String? _errorMessage;

  PaymentsLoadStatus get status => _status;
  PaymentDisplay? get data => _data;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = PaymentsLoadStatus.loading;
    notifyListeners();
    try {
      final payment = await _repository.getPayment();
      final order = await _repository.getOrder();
      final quote = await _repository.getQuote();
      final service = await _repository.getService();
      final provider = await _repository.getProvider();
      final profile = await _repository.getProfile();
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
    }
    notifyListeners();
  }

  Future<void> retry() => load();
}
