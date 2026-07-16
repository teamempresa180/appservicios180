import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../mappers/verification_mapper.dart';
import '../../mock/mock_verification_data.dart';
import '../../models/verification_display.dart';
import '../../repositories/verification_repository.dart';

enum VerificationLoadStatus { loading, success, error }

/// Owns the async load of [VerificationPage]'s data against the real
/// [VerificationRepository] (resolved via DI, see
/// `core/di/service_locator.dart`). Replaces the previous
/// build-time-only `_buildData()` now that every repository method is
/// a `Future`.
///
/// [VerificationDisplay.verificationStatus]/[completedSteps]/
/// [pendingSteps]/[rejectedReason]/[estimatedReviewTime] stay
/// simulated (`mockVerification*`) — see `VerificationDisplay`'s
/// class doc.
class VerificationViewModel extends ChangeNotifier {
  VerificationViewModel(this._repository);

  final VerificationRepository _repository;

  VerificationLoadStatus _status = VerificationLoadStatus.loading;
  VerificationDisplay? _data;
  String? _errorMessage;

  VerificationLoadStatus get status => _status;
  VerificationDisplay? get data => _data;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = VerificationLoadStatus.loading;
    notifyListeners();
    try {
      _data = await VerificationMapper.toDisplay(
        repository: _repository,
        verificationStatus: mockVerificationStatus,
        completedSteps: mockVerificationCompletedSteps,
        pendingSteps: mockVerificationPendingSteps,
        rejectedReason: mockVerificationRejectedReason,
        estimatedReviewTime: mockVerificationEstimatedReviewTime,
      );
      _status = VerificationLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = VerificationLoadStatus.error;
    }
    notifyListeners();
  }

  Future<void> retry() => load();
}
