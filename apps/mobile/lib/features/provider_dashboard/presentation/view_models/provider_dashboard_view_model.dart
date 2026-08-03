import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../mappers/provider_dashboard_mapper.dart';
import '../../models/provider_dashboard_display.dart';
import '../../repositories/provider_dashboard_repository.dart';

enum ProviderDashboardLoadStatus { loading, success, error }

/// Owns the async load of [ProviderDashboardPage]'s data against the
/// real [ProviderDashboardRepository] (backend-backed via DI, see
/// `core/di/service_locator.dart`). Replaces the previous
/// build-time-only `_buildData()` now that the repository's six
/// methods are `Future`s — a real network call needs a real
/// Loading/Success/Error state, not a fixed `state` toggle.
///
/// No longer injects any simulated earnings/response-time/acceptance
/// figure into the display model — see
/// `ProviderDashboardDisplay`'s class doc.
class ProviderDashboardViewModel extends ChangeNotifier {
  ProviderDashboardViewModel(this._repository);

  final ProviderDashboardRepository _repository;

  /// Guards every [notifyListeners] call below — the page's
  /// `_onViewModelChanged` listener may still be scheduled after
  /// `dispose()` runs (e.g. an in-flight `load()` completing after the
  /// user navigated away), and calling `notifyListeners()` on a
  /// disposed `ChangeNotifier` throws.
  bool _disposed = false;

  ProviderDashboardLoadStatus _status = ProviderDashboardLoadStatus.loading;
  ProviderDashboardDisplay? _data;
  String? _errorMessage;

  ProviderDashboardLoadStatus get status => _status;
  ProviderDashboardDisplay? get data => _data;
  String? get errorMessage => _errorMessage;

  /// Reloads without tearing the already-rendered dashboard down to a
  /// full-page "Cargando panel..." spinner — used after a successful
  /// start/complete action, where the provider is looking straight at
  /// the card that just changed and a flash back to an empty loading
  /// screen reads as if something went wrong.
  Future<void> refresh() => load(silent: _data != null);

  Future<void> load({bool silent = false}) async {
    if (!silent) {
      _status = ProviderDashboardLoadStatus.loading;
      if (!_disposed) notifyListeners();
    }
    try {
      final data = await ProviderDashboardMapper.toDisplay(
        repository: _repository,
      );
      _data = data;
      _status = ProviderDashboardLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = ProviderDashboardLoadStatus.error;
    } catch (_) {
      _errorMessage = 'Ocurrió un problema inesperado. Intenta de nuevo.';
      _status = ProviderDashboardLoadStatus.error;
    }
    if (!_disposed) notifyListeners();
  }

  Future<void> retry() => load();

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }
}
