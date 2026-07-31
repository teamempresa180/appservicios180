import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../review/entities/review.dart';
import '../../../../service/entities/service.dart';
import '../../mock/mock_service_detail_data.dart';
import '../../models/service_detail_data.dart';
import '../../repositories/service_detail_repository.dart';

enum ServiceDetailLoadStatus { loading, success, error }

/// Owns the async load of [ServiceDetailPage]'s data against the real
/// [ServiceDetailRepository] (backend-backed via DI, see
/// `core/di/service_locator.dart`). Replaces the previous
/// build-time-only `_buildData()` now that every repository getter is a
/// `Future` — a real network call needs a real Loading/Success/Error
/// state, not a synchronous build.
///
/// When [presetService] is supplied (the normal path — Marketplace/
/// Search already have the real [Service] the user tapped), it's used
/// directly instead of falling back to [ServiceDetailRepository.getService]'s
/// single fixed record, so different cards genuinely open different
/// services.
class ServiceDetailViewModel extends ChangeNotifier {
  ServiceDetailViewModel(this._repository, {Service? presetService})
    : _presetService = presetService;

  final ServiceDetailRepository _repository;
  final Service? _presetService;

  ServiceDetailLoadStatus _status = ServiceDetailLoadStatus.loading;
  ServiceDetailData? _data;
  String? _errorMessage;
  bool _disposed = false;

  ServiceDetailLoadStatus get status => _status;
  ServiceDetailData? get data => _data;
  String? get errorMessage => _errorMessage;

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }

  void _notifyIfActive() {
    if (!_disposed) notifyListeners();
  }

  Future<void> load() async {
    _status = ServiceDetailLoadStatus.loading;
    _notifyIfActive();
    try {
      final service = _presetService ?? await _repository.getService();

      // Each call is started before any is awaited, so the three
      // requests that only depend on `service` run concurrently.
      final providerFuture = _repository.getProviderFor(service);
      final categoryFuture = _repository.getCategoryFor(service);
      final reviewsFuture = _repository.getReviewsFor(service);

      final provider = await providerFuture;
      final profile = await _repository.getProviderProfileFor(provider);
      final category = await categoryFuture;
      final reviews = await reviewsFuture;

      final averageRating = reviews.isEmpty
          ? 0.0
          : reviews
                    .map((Review review) => review.rating.value)
                    .reduce((a, b) => a + b) /
                reviews.length;

      if (_disposed) return;
      _data = ServiceDetailData(
        service: service,
        provider: provider,
        profile: profile,
        category: category,
        reviews: reviews,
        rating: averageRating.toDouble(),
        reviewsCount: reviews.length,
        images: mockServiceDetailImages,
        longDescription: mockServiceDetailLongDescription,
      );
      _status = ServiceDetailLoadStatus.success;
    } on HttpException catch (exception) {
      if (_disposed) return;
      _errorMessage = exception.message;
      _status = ServiceDetailLoadStatus.error;
    } catch (_) {
      if (_disposed) return;
      _errorMessage = 'Ocurrió un problema inesperado. Intenta de nuevo.';
      _status = ServiceDetailLoadStatus.error;
    }
    _notifyIfActive();
  }

  Future<void> retry() => load();
}
