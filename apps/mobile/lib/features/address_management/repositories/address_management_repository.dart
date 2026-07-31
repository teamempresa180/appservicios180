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
  /// [latitude]/[longitude] are an optional map pin — both provided
  /// together, or both omitted (never just one).
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
  });

  /// Only `alias`/`fullAddress`/`latitude`/`longitude` are updatable —
  /// matches the backend's `UpdateAddressRequestDto` contract
  /// (city/state/country/postalCode aren't). Pass both `latitude`/
  /// `longitude` as `null` to explicitly clear an existing pin, both
  /// as numbers to set/move it, or both `null` (the default) when the
  /// address never had one.
  Future<Address> updateAddress(
    Address address, {
    required String alias,
    required String fullAddress,
    double? latitude,
    double? longitude,
  });

  Future<void> deleteAddress(Address address);
}
