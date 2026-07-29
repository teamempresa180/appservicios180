import 'package:flutter/foundation.dart' hide Category;
import '../../../../category/entities/category.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../profiles/entities/profile.dart';
import '../../../../provider/entities/provider.dart';
import '../../../../service/entities/service.dart';
import '../../mock/mock_request_service_data.dart';
import '../../models/request_service_data.dart';
import '../../repositories/request_service_repository.dart';

enum RequestServiceLoadStatus { loading, success, error }

/// Owns the async load of [RequestServicePage]'s data against the real
/// [RequestServiceRepository] (backend-backed via DI, see
/// `core/di/service_locator.dart`).
///
/// Unlike before, [category]/[provider]/[service]/[profile] are no
/// longer fetched blindly — they come from real navigation-time context
/// (the caller already resolved them, e.g. `ProviderProfilePage`'s
/// "Solicitar servicio"/"Publicar solicitud abierta" actions). Only
/// [RequestServiceRepository.getAddress] is still fetched here — every
/// other non-domain field ([selectedDate]/[selectedTime]/
/// [problemDescription]/[attachments]/[priority]/
/// [simulatedLocationLabel]) stays simulated (see
/// [RequestServiceData]'s own doc comment).
class RequestServiceViewModel extends ChangeNotifier {
  RequestServiceViewModel(
    this._repository, {
    required this.category,
    this.provider,
    this.service,
    this.profile,
  });

  final RequestServiceRepository _repository;
  final Category category;
  final Provider? provider;
  final Service? service;
  final Profile? profile;

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
      final address = await _repository.getAddress();
      _data = RequestServiceData(
        category: category,
        provider: provider,
        service: service,
        profile: profile,
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
