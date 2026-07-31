import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../mappers/settings_mapper.dart';
import '../../models/settings_display.dart';
import '../../repositories/settings_repository.dart';

enum SettingsLoadStatus { loading, success, error }

/// Owns the async load of [SettingsPage]'s data against the real
/// [SettingsRepository] (resolved via DI, see
/// `core/di/service_locator.dart`). Replaces the previous
/// build-time-only `_buildData()` now that `getProfile()` is a
/// `Future` — a real network call needs a real Loading/Success/Error
/// state, not a fixed `state` toggle.
class SettingsViewModel extends ChangeNotifier {
  SettingsViewModel(this._repository);

  final SettingsRepository _repository;

  SettingsLoadStatus _status = SettingsLoadStatus.loading;
  SettingsDisplay? _data;
  String? _errorMessage;
  bool _disposed = false;

  SettingsLoadStatus get status => _status;
  SettingsDisplay? get data => _data;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = SettingsLoadStatus.loading;
    _notifyListenersIfMounted();
    try {
      _data = await SettingsMapper.toDisplay(_repository);
      _status = SettingsLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = SettingsLoadStatus.error;
    } catch (_) {
      _errorMessage = 'Ocurrió un problema inesperado. Intenta de nuevo.';
      _status = SettingsLoadStatus.error;
    }
    _notifyListenersIfMounted();
  }

  Future<void> retry() => load();

  void _notifyListenersIfMounted() {
    if (_disposed) return;
    notifyListeners();
  }

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }
}
