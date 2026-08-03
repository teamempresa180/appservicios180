import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../profiles/entities/profile.dart';
import '../../../../provider/entities/provider.dart';
import '../../../../service/entities/service.dart';
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

  /// Guards every [notifyListeners] call — see
  /// `ProviderDashboardViewModel._disposed`'s doc comment for why.
  bool _disposed = false;

  ProviderServicesLoadStatus _status = ProviderServicesLoadStatus.loading;
  List<ProviderServiceDisplay> _services = const [];
  String? _errorMessage;

  ProviderServicesLoadStatus get status => _status;
  List<ProviderServiceDisplay> get services => _services;
  String? get errorMessage => _errorMessage;

  /// Reloads without collapsing the already-rendered list back to a
  /// full-page "Cargando servicios..." spinner — used after a
  /// successful create/edit/pause/delete, where flashing an empty
  /// loading screen at a provider who just tapped a button reads as if
  /// something broke.
  Future<void> refresh() => load(silent: _services.isNotEmpty);

  Future<void> load({bool silent = false}) async {
    if (!silent) {
      _status = ProviderServicesLoadStatus.loading;
      if (!_disposed) notifyListeners();
    }
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
    } catch (_) {
      _errorMessage = 'Ocurrió un problema inesperado. Intenta de nuevo.';
      _status = ProviderServicesLoadStatus.error;
    }
    if (!_disposed) notifyListeners();
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
    );
  }

  Future<void> retry() => load();

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }
}
