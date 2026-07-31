import '../../../address/entities/address.dart';
import '../../../address/models/address_id.dart';
import '../../../address/models/address_status.dart';
import '../../../address/models/address_type.dart';
import '../../../contact/entities/contact.dart';
import '../../../profiles/entities/profile.dart';
import '../mock/mock_addresses_data.dart';
import 'address_management_repository.dart';

/// In-memory `AddressManagementRepository` backed by fixed mock data.
/// No backend, no persistence, no network — see the feature README.
/// Keeps its own mutable copy of [mockAddresses] (same pattern as
/// `MockOrdersRepository`'s `_orders` field) so create/update/delete
/// actually change what [getAddresses] returns afterwards.
class MockAddressManagementRepository implements AddressManagementRepository {
  final List<Address> _addresses = List.of(mockAddresses);

  @override
  Future<List<Address>> getAddresses() =>
      Future.value(List.unmodifiable(_addresses));

  @override
  Future<Profile> getProfile() => Future.value(mockAddressesProfile);

  @override
  Future<Contact> getContactFor(Address address) =>
      Future.value(mockAddressesContact);

  @override
  Future<Address> createAddress({
    required String alias,
    required String fullAddress,
    required String city,
    required String state,
    required String country,
    required String postalCode,
    required AddressType type,
    double? latitude,
    double? longitude,
  }) async {
    final address = Address(
      id: AddressId.create(),
      identityId: mockAddressesProfile.identityId,
      alias: alias,
      fullAddress: fullAddress,
      city: city,
      state: state,
      country: country,
      postalCode: postalCode,
      latitude: latitude,
      longitude: longitude,
      type: type,
      status: AddressStatus.active,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
    _addresses.add(address);
    return address;
  }

  @override
  Future<Address> updateAddress(
    Address address, {
    required String alias,
    required String fullAddress,
    double? latitude,
    double? longitude,
  }) async {
    final updated = address.copyWith(
      alias: alias,
      fullAddress: fullAddress,
      latitude: latitude,
      longitude: longitude,
      clearLocation: latitude == null && longitude == null,
    );
    final index = _addresses.indexWhere((a) => a.id == address.id);
    if (index != -1) _addresses[index] = updated;
    return updated;
  }

  @override
  Future<void> deleteAddress(Address address) async {
    _addresses.removeWhere((a) => a.id == address.id);
  }
}
