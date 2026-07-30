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
  bool _disposed = false;

  RequestServiceLoadStatus get status => _status;
  RequestServiceData? get data => _data;
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
    _status = RequestServiceLoadStatus.loading;
    _notifyIfActive();
    try {
      final address = await _repository.getAddress();
      if (_disposed) return;
      _data = RequestServiceData(
        category: category,
        provider: provider,
        service: service,
        profile: profile,
        address: address,
        selectedDate: defaultRequestServiceScheduledDate(),
        selectedTime: mockRequestServiceSelectedTime,
        // Empty, not a canned example description — a real client must
        // type their own before "Continuar" is allowed (see
        // `RequestServicePage._submit`'s non-empty check); a prefilled
        // fake description used to be silently submittable as-is.
        problemDescription: '',
        attachments: mockRequestServiceAttachments,
        priority: mockRequestServicePriority,
        simulatedLocationLabel: mockRequestServiceLocationLabel,
      );
      _status = RequestServiceLoadStatus.success;
    } on HttpException catch (exception) {
      if (_disposed) return;
      _errorMessage = exception.message;
      _status = RequestServiceLoadStatus.error;
    } catch (_) {
      // `getAddress()` throws a plain `StateError` (not an
      // `HttpException`) when the current session has no saved address
      // at all — a real possibility for a brand-new pilot account that
      // hasn't visited Direcciones yet. Uncaught, that used to leave
      // this screen stuck on "Cargando solicitud..." forever (the
      // exception never reached this view model's error state). Now it
      // surfaces as a normal, retryable error instead.
      if (_disposed) return;
      _errorMessage =
          'No tienes una dirección guardada. Agrega una dirección en '
          'tu perfil antes de continuar.';
      _status = RequestServiceLoadStatus.error;
    }
    _notifyIfActive();
  }

  Future<void> retry() => load();
}
