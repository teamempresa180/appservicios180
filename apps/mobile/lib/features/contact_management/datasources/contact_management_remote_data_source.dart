import '../../../contact/entities/contact.dart';
import '../../../profiles/entities/profile.dart';

/// Remote (API/Firebase) source for the domain entities the Contact
/// Management screen needs. No implementation — see
/// `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
abstract class ContactManagementRemoteDataSource {
  Future<Profile> getProfile();
  Future<List<Contact>> getContacts();
}
