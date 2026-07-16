import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../mappers/profile_mapper.dart';
import '../../mock/mock_profile_data.dart';
import '../../models/profile_display.dart';
import '../../repositories/profile_repository.dart';

enum ProfileLoadStatus { loading, success, error }

/// Owns the async load of [ProfilePage]'s data against the real
/// [ProfileRepository] (resolved via DI, see
/// `core/di/service_locator.dart`). Replaces the previous
/// build-time-only `_buildData()` now that every repository method is
/// a `Future`.
///
/// [completionPercentage]/[profileCompletionItems] stay simulated
/// (`mockProfileCompletionPercentage` etc.) — see `ProfileDisplay`'s
/// class doc.
class ProfileViewModel extends ChangeNotifier {
  ProfileViewModel(this._repository);

  final ProfileRepository _repository;

  ProfileLoadStatus _status = ProfileLoadStatus.loading;
  ProfileDisplay? _data;
  String? _errorMessage;

  ProfileLoadStatus get status => _status;
  ProfileDisplay? get data => _data;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = ProfileLoadStatus.loading;
    notifyListeners();
    try {
      _data = await ProfileMapper.toDisplay(
        repository: _repository,
        completionPercentage: mockProfileCompletionPercentage,
        profileCompletionItems: mockProfileCompletionItems,
      );
      _status = ProfileLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = ProfileLoadStatus.error;
    }
    notifyListeners();
  }

  Future<void> retry() => load();
}
