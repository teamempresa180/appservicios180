import '../../../address/entities/address.dart';
import '../../../contact/entities/contact.dart';
import '../../../profiles/entities/profile.dart';
import '../mock/mock_addresses_data.dart';
import 'address_management_repository.dart';

/// In-memory `AddressManagementRepository` backed by fixed mock data.
/// No backend, no persistence, no network — see the feature README.
class MockAddressManagementRepository implements AddressManagementRepository {
  @override
  List<Address> getAddresses() => List.unmodifiable(mockAddresses);

  @override
  Profile getProfile() => mockAddressesProfile;

  @override
  Contact getContactFor(Address address) => mockAddressesContact;
}
