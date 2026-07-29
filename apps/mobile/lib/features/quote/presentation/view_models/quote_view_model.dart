import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../order/entities/order.dart';
import '../../../../quote/entities/quote.dart';
import '../../models/quote_data.dart';
import '../../repositories/quote_repository.dart';

enum QuoteLoadStatus { loading, success, error }

/// Owns the async load of [QuotePage]'s data against the real
/// [QuoteRepository] (backend-backed via DI, see
/// `core/di/service_locator.dart`). Loads every `Quote` submitted for
/// [order], each enriched with its submitting `Provider`/`Profile` —
/// see [QuoteEntry].
class QuoteViewModel extends ChangeNotifier {
  QuoteViewModel(this._repository, this.order);

  final QuoteRepository _repository;
  final Order order;

  QuoteLoadStatus _status = QuoteLoadStatus.loading;
  List<QuoteEntry> _entries = const [];
  String? _errorMessage;

  QuoteLoadStatus get status => _status;
  List<QuoteEntry> get entries => _entries;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = QuoteLoadStatus.loading;
    notifyListeners();
    try {
      final quotes = await _repository.getQuotesForOrder(order.id);
      _entries = await Future.wait(quotes.map(_buildEntry));
      _status = QuoteLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = QuoteLoadStatus.error;
    }
    notifyListeners();
  }

  Future<QuoteEntry> _buildEntry(Quote quote) async {
    final provider = await _repository.getProviderFor(quote);
    final profile = await _repository.getProfileFor(quote);
    return QuoteEntry(quote: quote, provider: provider, profile: profile);
  }

  Future<void> retry() => load();
}
