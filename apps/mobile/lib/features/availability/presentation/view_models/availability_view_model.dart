import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../mock/mock_availability_data.dart';
import '../../models/availability_display.dart';
import '../../repositories/availability_repository.dart';

enum AvailabilityLoadStatus { loading, success, error }

/// Owns the async load of [AvailabilityPage]'s data against the real
/// [AvailabilityRepository] (resolved via DI, see
/// `core/di/service_locator.dart`). Replaces the previous
/// build-time-only `_buildData()` now that `getProvider()`/
/// `getAvailabilities()` are `Future`s — a real network call needs a
/// real Loading/Success/Error state, not a fixed `state` parameter.
///
/// [AvailabilityDisplay.nextAvailableLabel]/[workingHoursLabel] stay
/// simulated (`mockAvailabilityNextAvailableLabel` etc.) — there is
/// still no real calendar-aggregation logic backing either, on either
/// the Flutter or the backend side.
class AvailabilityViewModel extends ChangeNotifier {
  AvailabilityViewModel(this._repository);

  final AvailabilityRepository _repository;

  /// Guards every [notifyListeners] call — see
  /// `ProviderDashboardViewModel._disposed`'s doc comment for why.
  bool _disposed = false;

  AvailabilityLoadStatus _status = AvailabilityLoadStatus.loading;
  AvailabilityDisplay? _data;
  String? _errorMessage;

  AvailabilityLoadStatus get status => _status;
  AvailabilityDisplay? get data => _data;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = AvailabilityLoadStatus.loading;
    if (!_disposed) notifyListeners();
    try {
      final provider = await _repository.getProvider();
      final availabilities = await _repository.getAvailabilities();
      _data = AvailabilityDisplay(
        provider: provider,
        availabilities: availabilities,
        nextAvailableLabel: mockAvailabilityNextAvailableLabel,
        workingHoursLabel: mockAvailabilityWorkingHoursLabel,
      );
      _status = AvailabilityLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = AvailabilityLoadStatus.error;
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
