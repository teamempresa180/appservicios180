import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../service/entities/service.dart';
import '../../mock/mock_search_data.dart';
import '../../models/search_result.dart';
import '../../repositories/search_repository.dart';

enum SearchLoadStatus { loading, success, error }

/// Owns the async load of [SearchPage]'s data against the real
/// [SearchRepository] (backend-backed via DI, see
/// `core/di/service_locator.dart`). Each result's `Provider`/
/// `Category`/rating/reviewsCount are now real, resolved per service
/// via `providerOf`/`categoryOf`/`ratingOf`/`reviewsCountOf` — only
/// `distance` stays simulated (see [SearchResult] and the feature
/// README: no real geolocation exists yet).
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
      _results = await Future.wait(services.map(_buildResult));
      _status = SearchLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = SearchLoadStatus.error;
    }
    notifyListeners();
  }

  Future<SearchResult> _buildResult(Service service) async {
    final provider = await _repository.providerOf(service.providerId);
    final category = await _repository.categoryOf(service.categoryId);
    final rating = await _repository.ratingOf(service.providerId);
    final reviewsCount = await _repository.reviewsCountOf(
      service.providerId,
    );
    return SearchResult(
      service: service,
      provider: provider,
      category: category,
      rating: rating,
      reviewsCount: reviewsCount,
      distance: mockSearchDistanceKm[service.id.value] ?? 1.0,
    );
  }

  Future<void> retry() => load();
}
