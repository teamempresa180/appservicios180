import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../mock/mock_provider_profile_data.dart';
import '../../models/provider_profile_data.dart';
import '../../repositories/provider_profile_repository.dart';

enum ProviderProfileLoadStatus { loading, success, error }

/// Owns the async load of [ProviderProfilePage]'s data against the real
/// [ProviderProfileRepository] (backend-backed via DI, see
/// `core/di/service_locator.dart`). Replaces the previous
/// build-time-only `_buildData()` now that every repository getter is a
/// `Future` — a real network call needs a real Loading/Success/Error
/// state, not a synchronous build.
///
/// [rating] and [reviewsCount] are still derived from the loaded
/// reviews; [completedServices], [responseTime], [coverImages], [about]
/// and [specialties] are still simulated constants sourced from the
/// feature's mock data file — see `ProviderProfileData`'s class doc for
/// why those aren't modeled by any domain entity yet.
class ProviderProfileViewModel extends ChangeNotifier {
  ProviderProfileViewModel(this._repository);

  final ProviderProfileRepository _repository;

  ProviderProfileLoadStatus _status = ProviderProfileLoadStatus.loading;
  ProviderProfileData? _data;
  String? _errorMessage;

  ProviderProfileLoadStatus get status => _status;
  ProviderProfileData? get data => _data;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = ProviderProfileLoadStatus.loading;
    notifyListeners();
    try {
      // Awaited sequentially rather than via `Future.wait` — every
      // getter on the interim `ProviderProfileRepository` independently
      // re-resolves "the current provider" from scratch (see
      // `HttpProviderProfileRepository`'s doc comment), so starting all
      // six concurrently just means every one of them fails
      // independently the moment the provider lookup itself fails,
      // which surfaces as unhandled-future errors instead of the single
      // caught [HttpException] below.
      final provider = await _repository.getProvider();
      final profile = await _repository.getProfile();
      final availability = await _repository.getAvailability();
      final reviews = await _repository.getReviews();
      final services = await _repository.getServices();
      final categories = await _repository.getCategories();

      final averageRating = reviews.isEmpty
          ? 0.0
          : reviews.map((review) => review.rating.value).reduce(
                  (a, b) => a + b,
                ) /
                reviews.length;

      _data = ProviderProfileData(
        provider: provider,
        profile: profile,
        availability: availability,
        reviews: reviews,
        services: services,
        categories: categories,
        rating: averageRating.toDouble(),
        reviewsCount: reviews.length,
        completedServices: mockProviderProfileCompletedServices,
        responseTime: mockProviderProfileResponseTime,
        coverImages: mockProviderProfileCoverImages,
        about: mockProviderProfileAbout,
        specialties: mockProviderProfileSpecialties,
      );
      _status = ProviderProfileLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = ProviderProfileLoadStatus.error;
    }
    notifyListeners();
  }

  Future<void> retry() => load();
}
