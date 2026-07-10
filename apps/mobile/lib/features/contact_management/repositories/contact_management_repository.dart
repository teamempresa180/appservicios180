import '../../../contact/entities/contact.dart';
import '../../../profiles/entities/profile.dart';

/// Contract for reading the domain entities the Contact Management
/// screen needs. Returns only real domain entities — no `Map`, no
/// `dynamic`, no JSON. Implemented today by
/// `MockContactManagementRepository`; a future
/// `ApiContactManagementRepository` would implement this same
/// interface (see the feature README).
abstract class ContactManagementRepository {
  Profile getProfile();
  List<Contact> getContacts();
}
