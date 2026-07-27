import '../../../address/entities/address.dart';
import '../../../address/models/address_type.dart';
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

  /// Creates a new [Address] for the current session's identity.
  Future<Address> createAddress({
    required String alias,
    required String fullAddress,
    required String city,
    required String state,
    required String country,
    required String postalCode,
    required AddressType type,
  });

  /// Only `alias`/`fullAddress` are updatable — matches the backend's
  /// `UpdateAddressRequestDto` contract (city/state/country/postalCode
  /// aren't).
  Future<Address> updateAddress(
    Address address, {
    required String alias,
    required String fullAddress,
  });

  Future<void> deleteAddress(Address address);
}
