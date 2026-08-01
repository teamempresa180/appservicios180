import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../mappers/security_mapper.dart';
import '../../models/security_display.dart';
import '../../repositories/security_repository.dart';

enum SecurityLoadStatus { loading, success, error }

/// Owns the async load of [SecurityPage]'s data against the real
/// [SecurityRepository] (resolved via DI, see
/// `core/di/service_locator.dart`).
class SecurityViewModel extends ChangeNotifier {
  SecurityViewModel(this._repository);

  final SecurityRepository _repository;

  SecurityLoadStatus _status = SecurityLoadStatus.loading;
  SecurityDisplay? _data;
  String? _errorMessage;
  bool _disposed = false;

  SecurityLoadStatus get status => _status;
  SecurityDisplay? get data => _data;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = SecurityLoadStatus.loading;
    _notifyListenersIfMounted();
    try {
      _data = await SecurityMapper.toDisplay(_repository);
      _status = SecurityLoadStatus.success;
    } on HttpException catch (exception) {
      // A lost-connectivity failure never got a response, so its
      // `message` is Dio's raw, English, technical exception text —
      // not something to show verbatim in a Spanish-language app (see
      // `HttpException.isConnectivityIssue`).
      _errorMessage = exception.isConnectivityIssue
          ? 'No hay conexión a internet. Verifica tu conexión e intenta de nuevo.'
          : exception.message;
      _status = SecurityLoadStatus.error;
    } catch (_) {
      _errorMessage = 'Ocurrió un problema inesperado. Intenta de nuevo.';
      _status = SecurityLoadStatus.error;
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
