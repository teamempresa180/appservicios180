import '../../../contact/entities/contact.dart';
import '../../../contact/models/contact_type.dart';
import '../../../profiles/entities/profile.dart';

/// Contract for reading the domain entities the Contact Management
/// screen needs. Returns only real domain entities — no `Map`, no
/// `dynamic`, no JSON. Implemented today by
/// `MockContactManagementRepository`; a future
/// `ApiContactManagementRepository` would implement this same
/// interface (see the feature README).
abstract class ContactManagementRepository {
  Future<Profile> getProfile();
  Future<List<Contact>> getContacts();

  Future<Contact> createContact({required ContactType type, required String value});

  /// Only `value` is updatable — matches the backend's
  /// `UpdateContactRequestDto` contract (`type` isn't).
  Future<Contact> updateContact(Contact contact, {required String value});

  Future<void> deleteContact(Contact contact);
}
