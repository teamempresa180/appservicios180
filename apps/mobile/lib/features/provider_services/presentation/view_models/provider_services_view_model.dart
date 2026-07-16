import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../profiles/entities/profile.dart';
import '../../../../provider/entities/provider.dart';
import '../../../../service/entities/service.dart';
import '../../mock/mock_provider_services_data.dart';
import '../../models/provider_service_display.dart';
import '../../repositories/provider_services_repository.dart';

enum ProviderServicesLoadStatus { loading, success, error }

/// Owns the async load of [ProviderServicesPage]'s data against the
/// real [ProviderServicesRepository] (resolved via DI, see
/// `core/di/service_locator.dart`). Replaces the previous
/// build-time-only `_buildServices()` now that every repository method
/// is a `Future` — a real network call needs a real
/// Loading/Success/Error state, not a fixed `state` toggle.
class ProviderServicesViewModel extends ChangeNotifier {
  ProviderServicesViewModel(this._repository);

  final ProviderServicesRepository _repository;

  ProviderServicesLoadStatus _status = ProviderServicesLoadStatus.loading;
  List<ProviderServiceDisplay> _services = const [];
  String? _errorMessage;

  ProviderServicesLoadStatus get status => _status;
  List<ProviderServiceDisplay> get services => _services;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = ProviderServicesLoadStatus.loading;
    notifyListeners();
    try {
      final provider = await _repository.getProvider();
      final profile = await _repository.getProfile();
      final services = await _repository.getServices();
      _services = await Future.wait(
        services.map((service) => _buildDisplay(provider, profile, service)),
      );
      _status = ProviderServicesLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = ProviderServicesLoadStatus.error;
    }
    notifyListeners();
  }

  Future<ProviderServiceDisplay> _buildDisplay(
    Provider provider,
    Profile profile,
    Service service,
  ) async {
    final category = await _repository.getCategoryFor(service);
    return ProviderServiceDisplay(
      provider: provider,
      profile: profile,
      service: service,
      category: category,
      viewsCount: mockServiceViewsCount[service.id] ?? 0,
      requestsCount: mockServiceRequestsCount[service.id] ?? 0,
      featured: mockServiceFeatured[service.id] ?? false,
      lastUpdatedLabel: mockServiceLastUpdatedLabel[service.id] ?? '—',
    );
  }

  Future<void> retry() => load();
}
