import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../mock/mock_request_service_data.dart';
import '../../models/request_service_data.dart';
import '../../repositories/request_service_repository.dart';

enum RequestServiceLoadStatus { loading, success, error }

/// Owns the async load of [RequestServicePage]'s data against the real
/// [RequestServiceRepository] (backend-backed via DI, see
/// `core/di/service_locator.dart`). Composes the six awaited entities
/// into a [RequestServiceData] the same way the previous
/// build-time-only `_buildData()` did — every non-domain field
/// ([selectedDate]/[selectedTime]/[problemDescription]/[attachments]/
/// [priority]/[simulatedLocationLabel]) stays simulated (see
/// [RequestServiceData]'s own doc comment).
class RequestServiceViewModel extends ChangeNotifier {
  RequestServiceViewModel(this._repository);

  final RequestServiceRepository _repository;

  RequestServiceLoadStatus _status = RequestServiceLoadStatus.loading;
  RequestServiceData? _data;
  String? _errorMessage;

  RequestServiceLoadStatus get status => _status;
  RequestServiceData? get data => _data;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = RequestServiceLoadStatus.loading;
    notifyListeners();
    try {
      final service = await _repository.getService();
      final provider = await _repository.getProvider();
      final profile = await _repository.getProfile();
      final category = await _repository.getCategory();
      final availability = await _repository.getAvailability();
      final address = await _repository.getAddress();
      _data = RequestServiceData(
        service: service,
        provider: provider,
        profile: profile,
        category: category,
        availability: availability,
        address: address,
        selectedDate: mockRequestServiceSelectedDate,
        selectedTime: mockRequestServiceSelectedTime,
        problemDescription: mockRequestServiceProblemDescription,
        attachments: mockRequestServiceAttachments,
        priority: mockRequestServicePriority,
        simulatedLocationLabel: mockRequestServiceLocationLabel,
      );
      _status = RequestServiceLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = RequestServiceLoadStatus.error;
    }
    notifyListeners();
  }

  Future<void> retry() => load();
}
