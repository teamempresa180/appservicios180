import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../mock/mock_search_data.dart';
import '../../models/search_result.dart';
import '../../repositories/search_repository.dart';

enum SearchLoadStatus { loading, success, error }

/// Owns the async load of [SearchPage]'s data against the real
/// [SearchRepository] (backend-backed via DI, see
/// `core/di/service_locator.dart`). [SearchRepository] only exposes
/// `getAll()` (a `List<Service>`), so — same as before this migration —
/// each result's `Provider`/`Category`/rating/reviewsCount/distance are
/// still composed from the feature's own mock lookup tables (see
/// [SearchResult] and the feature README for why those stay simulated).
class SearchViewModel extends ChangeNotifier {
  SearchViewModel(this._repository);

  final SearchRepository _repository;

  SearchLoadStatus _status = SearchLoadStatus.loading;
  List<SearchResult> _results = const [];
  String? _errorMessage;

  SearchLoadStatus get status => _status;
  List<SearchResult> get results => _results;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = SearchLoadStatus.loading;
    notifyListeners();
    try {
      final services = await _repository.getAll();
      _results = [
        for (final service in services)
          SearchResult(
            service: service,
            provider: mockSearchProviders.firstWhere(
              (provider) => provider.id == service.providerId,
            ),
            category: mockSearchCategories.firstWhere(
              (category) => category.id == service.categoryId,
            ),
            rating: mockSearchRatings[service.id.value] ?? 4.5,
            reviewsCount: mockSearchReviewsCount[service.id.value] ?? 0,
            distance: mockSearchDistanceKm[service.id.value] ?? 1.0,
          ),
      ];
      _status = SearchLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = SearchLoadStatus.error;
    }
    notifyListeners();
  }

  Future<void> retry() => load();
}
