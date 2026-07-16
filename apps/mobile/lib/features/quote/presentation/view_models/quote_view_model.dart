import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../mock/mock_quote_data.dart';
import '../../models/quote_data.dart';
import '../../repositories/quote_repository.dart';

enum QuoteLoadStatus { loading, success, error }

/// Owns the async load of [QuotePage]'s data against the real
/// [QuoteRepository] (backend-backed via DI, see
/// `core/di/service_locator.dart`). Composes the six awaited entities
/// into a [QuoteData] the same way the previous build-time-only
/// `_buildData()` did — [travelFee]/[discount]/[taxes]/[estimatedDate]
/// stay simulated (see [QuoteData]'s own doc comment).
class QuoteViewModel extends ChangeNotifier {
  QuoteViewModel(this._repository);

  final QuoteRepository _repository;

  QuoteLoadStatus _status = QuoteLoadStatus.loading;
  QuoteData? _data;
  String? _errorMessage;

  QuoteLoadStatus get status => _status;
  QuoteData? get data => _data;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = QuoteLoadStatus.loading;
    notifyListeners();
    try {
      final quote = await _repository.getQuote();
      final service = await _repository.getService();
      final provider = await _repository.getProvider();
      final profile = await _repository.getProfile();
      final category = await _repository.getCategory();
      final address = await _repository.getAddress();
      _data = QuoteData(
        quote: quote,
        service: service,
        provider: provider,
        profile: profile,
        category: category,
        address: address,
        travelFee: mockQuoteTravelFee,
        discount: mockQuoteDiscount,
        taxes: mockQuoteTaxes,
        estimatedDate: mockQuoteEstimatedDate,
      );
      _status = QuoteLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = QuoteLoadStatus.error;
    }
    notifyListeners();
  }

  Future<void> retry() => load();
}
