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

  /// Every result fetched from the backend, unfiltered.
  List<SearchResult> _allResults = const [];

  /// [_allResults] narrowed down by the active query — what the UI
  /// actually renders. See [search].
  List<SearchResult> _results = const [];
  String _query = '';
  String? _errorMessage;
  bool _disposed = false;

  SearchLoadStatus get status => _status;
  List<SearchResult> get results => _results;
  String? get errorMessage => _errorMessage;

  /// Whether a non-empty query is active but matched nothing — lets the
  /// UI tell "you typed something and nothing matched" apart from "there
  /// is nothing to search at all".
  bool get isFilteredEmpty => _query.isNotEmpty && _results.isEmpty;

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }

  void _notifyIfActive() {
    if (!_disposed) notifyListeners();
  }

  Future<void> load() async {
    _status = SearchLoadStatus.loading;
    _notifyIfActive();
    try {
      final services = await _repository.getAll();
      final results = await Future.wait(services.map(_buildResult));
      if (_disposed) return;
      _allResults = results;
      _results = _filter(results, _query);
      _status = SearchLoadStatus.success;
    } on HttpException catch (exception) {
      if (_disposed) return;
      _errorMessage = exception.message;
      _status = SearchLoadStatus.error;
    } catch (_) {
      if (_disposed) return;
      _errorMessage = 'Ocurrió un problema inesperado. Intenta de nuevo.';
      _status = SearchLoadStatus.error;
    }
    _notifyIfActive();
  }

  /// Filters the already-loaded results by [query] — matches against the
  /// service name/description and its category name. Client-side only
  /// (no request round-trip), so it's instant as the user types.
  void search(String query) {
    final trimmed = query.trim();
    if (trimmed == _query) return;
    _query = trimmed;
    if (_status != SearchLoadStatus.success) return;
    _results = _filter(_allResults, trimmed);
    _notifyIfActive();
  }

  List<SearchResult> _filter(List<SearchResult> results, String query) {
    if (query.isEmpty) return results;
    final needle = query.toLowerCase();
    return results.where((result) {
      return result.service.name.toLowerCase().contains(needle) ||
          result.service.description.toLowerCase().contains(needle) ||
          result.category.name.toLowerCase().contains(needle);
    }).toList();
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
