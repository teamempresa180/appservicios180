import '../../../contact/entities/contact.dart';
import '../../../profiles/entities/profile.dart';

/// Local (on-device) source for the domain entities the Contact
/// Management screen needs. No implementation — see
/// `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
abstract class ContactManagementLocalDataSource {
  Profile getProfile();
  List<Contact> getContacts();
}
