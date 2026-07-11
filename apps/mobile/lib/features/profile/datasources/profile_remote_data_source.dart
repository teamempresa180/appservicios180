import '../../../address/entities/address.dart';
import '../../../contact/entities/contact.dart';
import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';

/// Remote (API/Firebase) source for the domain entities the Profile
/// screen needs. No implementation — see `PROJECT_STATUS.md` (Sprint
/// 2, Etapa 6).
abstract class ProfileRemoteDataSource {
  Future<Profile> getProfile();
  Future<Identity> getIdentity();
  Future<List<Contact>> getContacts();
  Future<Address> getAddress();
}
