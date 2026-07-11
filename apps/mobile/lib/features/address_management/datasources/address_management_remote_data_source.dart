import '../../../address/entities/address.dart';
import '../../../contact/entities/contact.dart';
import '../../../profiles/entities/profile.dart';

/// Remote (API/Firebase) source for the domain entities the Address
/// Management screen needs. Mirrors `AddressManagementLocalDataSource`
/// with `Future`-wrapped results, the shape a real HTTP/Firebase call
/// would have. No implementation — see `PROJECT_STATUS.md` (Sprint 2,
/// Etapa 6).
abstract class AddressManagementRemoteDataSource {
  Future<List<Address>> getAddresses();
  Future<Profile> getProfile();
  Future<Contact> getContactFor(Address address);
}
