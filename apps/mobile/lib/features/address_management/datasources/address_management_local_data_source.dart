import '../../../address/entities/address.dart';
import '../../../contact/entities/contact.dart';
import '../../../profiles/entities/profile.dart';

/// Local (on-device) source for the domain entities the Address
/// Management screen needs — a cache, local database, etc. once one
/// exists. Today `MockAddressManagementRepository` plays this role
/// directly with in-memory data; this interface documents the seam a
/// real local data source would fill in, with the exact same method
/// shapes the repository already exposes. No implementation — see
/// `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
abstract class AddressManagementLocalDataSource {
  List<Address> getAddresses();
  Profile getProfile();
  Contact getContactFor(Address address);
}
