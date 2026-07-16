import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../review/entities/review.dart';
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
class ServiceDetailViewModel extends ChangeNotifier {
  ServiceDetailViewModel(this._repository);

  final ServiceDetailRepository _repository;

  ServiceDetailLoadStatus _status = ServiceDetailLoadStatus.loading;
  ServiceDetailData? _data;
  String? _errorMessage;

  ServiceDetailLoadStatus get status => _status;
  ServiceDetailData? get data => _data;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = ServiceDetailLoadStatus.loading;
    notifyListeners();
    try {
      // Each call is started before any is awaited, so the five
      // requests run concurrently rather than sequentially.
      final serviceFuture = _repository.getService();
      final providerFuture = _repository.getProvider();
      final profileFuture = _repository.getProviderProfile();
      final categoryFuture = _repository.getCategory();
      final reviewsFuture = _repository.getReviews();

      final service = await serviceFuture;
      final provider = await providerFuture;
      final profile = await profileFuture;
      final category = await categoryFuture;
      final reviews = await reviewsFuture;

      final averageRating = reviews.isEmpty
          ? 0.0
          : reviews
                    .map((Review review) => review.rating.value)
                    .reduce((a, b) => a + b) /
                reviews.length;

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
      _errorMessage = exception.message;
      _status = ServiceDetailLoadStatus.error;
    }
    notifyListeners();
  }

  Future<void> retry() => load();
}
