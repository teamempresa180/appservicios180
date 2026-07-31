import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../mappers/trust_mapper.dart';
import '../../mock/mock_trust_data.dart';
import '../../models/trust_display.dart';
import '../../repositories/trust_repository.dart';

enum TrustLoadStatus { loading, success, error }

/// Owns the async load of [TrustPage]'s data against the real
/// [TrustRepository] (resolved via DI, see
/// `core/di/service_locator.dart`). Replaces the previous
/// build-time-only `_buildData()` now that every repository method is
/// a `Future`.
///
/// [TrustDisplay.factors] stays simulated (`mockTrustFactors`) — see
/// `TrustDisplay`'s class doc.
class TrustViewModel extends ChangeNotifier {
  TrustViewModel(this._repository);

  final TrustRepository _repository;

  /// Guards every [notifyListeners] call — see
  /// `ProviderDashboardViewModel._disposed`'s doc comment for why.
  bool _disposed = false;

  TrustLoadStatus _status = TrustLoadStatus.loading;
  TrustDisplay? _data;
  String? _errorMessage;

  TrustLoadStatus get status => _status;
  TrustDisplay? get data => _data;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = TrustLoadStatus.loading;
    if (!_disposed) notifyListeners();
    try {
      _data = await TrustMapper.toDisplay(
        repository: _repository,
        factors: mockTrustFactors,
      );
      _status = TrustLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = TrustLoadStatus.error;
    } catch (_) {
      _errorMessage = 'Ocurrió un problema inesperado. Intenta de nuevo.';
      _status = TrustLoadStatus.error;
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
