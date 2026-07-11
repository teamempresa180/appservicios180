import '../../../address/entities/address.dart';
import '../../../contact/entities/contact.dart';
import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';

/// Local (on-device) source for the domain entities the Profile
/// screen needs. No implementation — see `PROJECT_STATUS.md` (Sprint
/// 2, Etapa 6).
abstract class ProfileLocalDataSource {
  Profile getProfile();
  Identity getIdentity();
  List<Contact> getContacts();
  Address getAddress();
}
