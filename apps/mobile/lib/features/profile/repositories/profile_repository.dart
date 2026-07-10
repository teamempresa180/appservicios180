import '../../../address/entities/address.dart';
import '../../../contact/entities/contact.dart';
import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';

/// Contract for reading the domain entities the Profile screen needs.
/// Returns only real domain entities — no `Map`, no `dynamic`, no
/// JSON. Implemented today by `MockProfileRepository`; a future
/// `ApiProfileRepository` or `FirebaseProfileRepository` would
/// implement this same interface (see the feature README).
///
/// There is no id-based lookup yet — this feature shows a single fixed
/// account (see the feature README for why).
abstract class ProfileRepository {
  Profile getProfile();
  Identity getIdentity();
  List<Contact> getContacts();
  Address getAddress();
}
