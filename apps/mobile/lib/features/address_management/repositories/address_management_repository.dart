import '../../../address/entities/address.dart';
import '../../../contact/entities/contact.dart';
import '../../../profiles/entities/profile.dart';

/// Contract for reading the domain entities the Address Management
/// screen needs. Returns only real domain entities — no `Map`, no
/// `dynamic`, no JSON. Implemented today by
/// `MockAddressManagementRepository`; a future
/// `ApiAddressManagementRepository` or `FirebaseAddressManagementRepository`
/// would implement this same interface (see the feature README).
abstract class AddressManagementRepository {
  Future<List<Address>> getAddresses();
  Future<Profile> getProfile();
  Future<Contact> getContactFor(Address address);
}
