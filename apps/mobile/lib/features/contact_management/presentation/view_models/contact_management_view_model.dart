import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../models/contact_management_display.dart';
import '../../repositories/contact_management_repository.dart';

enum ContactManagementLoadStatus { loading, success, error }

/// Owns the async load of [ContactManagementPage]'s data against the
/// real [ContactManagementRepository] (resolved via DI, see
/// `core/di/service_locator.dart`). Replaces the previous
/// build-time-only `_buildData()` now that every repository method is
/// a `Future`.
class ContactManagementViewModel extends ChangeNotifier {
  ContactManagementViewModel(this._repository);

  final ContactManagementRepository _repository;

  ContactManagementLoadStatus _status = ContactManagementLoadStatus.loading;
  ContactManagementDisplay? _data;
  String? _errorMessage;
  bool _disposed = false;

  ContactManagementLoadStatus get status => _status;
  ContactManagementDisplay? get data => _data;
  String? get errorMessage => _errorMessage;

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }

  void _notifyIfActive() {
    if (!_disposed) notifyListeners();
  }

  Future<void> load() async {
    _status = ContactManagementLoadStatus.loading;
    _notifyIfActive();
    try {
      final profile = await _repository.getProfile();
      final contacts = await _repository.getContacts();
      if (_disposed) return;
      _data = ContactManagementDisplay(profile: profile, contacts: contacts);
      _status = ContactManagementLoadStatus.success;
    } on HttpException catch (exception) {
      if (_disposed) return;
      _errorMessage = exception.message;
      _status = ContactManagementLoadStatus.error;
    } catch (_) {
      if (_disposed) return;
      _errorMessage = 'Ocurrió un problema inesperado. Intenta de nuevo.';
      _status = ContactManagementLoadStatus.error;
    }
    _notifyIfActive();
  }

  Future<void> retry() => load();
}
