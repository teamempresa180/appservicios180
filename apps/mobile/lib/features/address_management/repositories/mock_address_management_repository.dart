import '../../../address/entities/address.dart';
import '../../../contact/entities/contact.dart';
import '../../../profiles/entities/profile.dart';
import '../mock/mock_addresses_data.dart';
import 'address_management_repository.dart';

/// In-memory `AddressManagementRepository` backed by fixed mock data.
/// No backend, no persistence, no network — see the feature README.
class MockAddressManagementRepository implements AddressManagementRepository {
  @override
  Future<List<Address>> getAddresses() =>
      Future.value(List.unmodifiable(mockAddresses));

  @override
  Future<Profile> getProfile() => Future.value(mockAddressesProfile);

  @override
  Future<Contact> getContactFor(Address address) =>
      Future.value(mockAddressesContact);
}
