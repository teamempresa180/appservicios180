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

  ContactManagementLoadStatus get status => _status;
  ContactManagementDisplay? get data => _data;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = ContactManagementLoadStatus.loading;
    notifyListeners();
    try {
      final profile = await _repository.getProfile();
      final contacts = await _repository.getContacts();
      _data = ContactManagementDisplay(profile: profile, contacts: contacts);
      _status = ContactManagementLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = ContactManagementLoadStatus.error;
    }
    notifyListeners();
  }

  Future<void> retry() => load();
}
