import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../models/schedule_display.dart';
import '../../repositories/schedule_repository.dart';

enum ScheduleLoadStatus { loading, success, error }

/// Owns the async load of [SchedulePage]'s data against the real
/// [ScheduleRepository] (backend-backed via DI, see
/// `core/di/service_locator.dart`). Replaces the previous
/// build-time-only `_buildData()` now that `getProvider()`/
/// `getSchedules()` are `Future`s — a real network call needs a real
/// Loading/Success/Error state, not a fixed `state` parameter.
class ScheduleViewModel extends ChangeNotifier {
  ScheduleViewModel(this._repository);

  final ScheduleRepository _repository;

  /// Guards every [notifyListeners] call — see
  /// `ProviderDashboardViewModel._disposed`'s doc comment for why.
  bool _disposed = false;

  ScheduleLoadStatus _status = ScheduleLoadStatus.loading;
  ScheduleDisplay? _data;
  String? _errorMessage;

  ScheduleLoadStatus get status => _status;
  ScheduleDisplay? get data => _data;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = ScheduleLoadStatus.loading;
    if (!_disposed) notifyListeners();
    try {
      final provider = await _repository.getProvider();
      final schedules = await _repository.getSchedules();
      _data = ScheduleDisplay(provider: provider, schedules: schedules);
      _status = ScheduleLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = ScheduleLoadStatus.error;
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
