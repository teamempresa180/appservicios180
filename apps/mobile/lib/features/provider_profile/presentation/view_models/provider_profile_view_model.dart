import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../profiles/entities/profile.dart';
import '../../../../provider/entities/provider.dart';
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
/// When [presetProvider]/[presetProfile] are supplied (the normal path —
/// Marketplace/Service Detail already have the real [Provider]/[Profile]
/// the user tapped), they're used directly instead of falling back to
/// [ProviderProfileRepository.getProvider]'s single fixed record, so
/// different cards genuinely open different providers.
///
/// [rating] and [reviewsCount] are still derived from the loaded
/// reviews; [completedServices], [responseTime], [coverImages], [about]
/// and [specialties] are still simulated constants sourced from the
/// feature's mock data file — see `ProviderProfileData`'s class doc for
/// why those aren't modeled by any domain entity yet.
class ProviderProfileViewModel extends ChangeNotifier {
  ProviderProfileViewModel(
    this._repository, {
    Provider? presetProvider,
    Profile? presetProfile,
  }) : _presetProvider = presetProvider,
       _presetProfile = presetProfile;

  final ProviderProfileRepository _repository;
  final Provider? _presetProvider;
  final Profile? _presetProfile;

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
      final provider = _presetProvider ?? await _repository.getProvider();

      // Every remaining getter takes `provider` directly, so they can
      // safely run concurrently — none of them re-resolve "the current
      // provider" from scratch anymore.
      final profileFuture =
          _presetProfile != null
              ? Future.value(_presetProfile)
              : _repository.getProfileFor(provider);
      final availabilityFuture = _repository.getAvailabilityFor(provider);
      final reviewsFuture = _repository.getReviewsFor(provider);
      final servicesFuture = _repository.getServicesFor(provider);

      final profile = await profileFuture;
      final availability = await availabilityFuture;
      final reviews = await reviewsFuture;
      final services = await servicesFuture;
      final categories = await _repository.getCategoriesFor(services);

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
