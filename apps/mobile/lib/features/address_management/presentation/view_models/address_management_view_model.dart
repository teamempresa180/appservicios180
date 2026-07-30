import 'package:flutter/foundation.dart';
import '../../../../address/entities/address.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../profiles/entities/profile.dart';
import '../../mock/mock_addresses_data.dart';
import '../../models/address_display.dart';
import '../../repositories/address_management_repository.dart';

enum AddressManagementLoadStatus { loading, success, error }

/// Owns the async load of [AddressManagementPage]'s data against the
/// real [AddressManagementRepository] (resolved via DI, see
/// `core/di/service_locator.dart`). Replaces the previous
/// build-time-only `_buildAddresses()` now that every repository
/// method is a `Future`.
///
/// [AddressDisplay.isDefault]/[deliveryInstructions] stay simulated
/// (`mockAddressIsDefault`/`mockAddressDeliveryInstructions`) — see
/// `AddressDisplay`'s class doc.
class AddressManagementViewModel extends ChangeNotifier {
  AddressManagementViewModel(this._repository);

  final AddressManagementRepository _repository;

  AddressManagementLoadStatus _status = AddressManagementLoadStatus.loading;
  List<AddressDisplay> _addresses = const [];
  String? _errorMessage;
  bool _disposed = false;

  AddressManagementLoadStatus get status => _status;
  List<AddressDisplay> get addresses => _addresses;
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
    _status = AddressManagementLoadStatus.loading;
    _notifyIfActive();
    try {
      final addresses = await _repository.getAddresses();
      final profile = await _repository.getProfile();
      final displays = await Future.wait(
        addresses.map((address) => _buildDisplay(address, profile)),
      );
      if (_disposed) return;
      _addresses = displays;
      _status = AddressManagementLoadStatus.success;
    } on HttpException catch (exception) {
      if (_disposed) return;
      _errorMessage = exception.message;
      _status = AddressManagementLoadStatus.error;
    }
    _notifyIfActive();
  }

  Future<AddressDisplay> _buildDisplay(Address address, Profile profile) async {
    final contact = await _repository.getContactFor(address);
    return AddressDisplay(
      address: address,
      profile: profile,
      contact: contact,
      // `??` fallback: addresses created after this session started
      // (see `AddressFormSheet`) aren't in this fixed simulated map.
      isDefault: mockAddressIsDefault[address.id] ?? false,
      deliveryInstructions: mockAddressDeliveryInstructions[address.id] ?? '',
    );
  }

  Future<void> retry() => load();
}
