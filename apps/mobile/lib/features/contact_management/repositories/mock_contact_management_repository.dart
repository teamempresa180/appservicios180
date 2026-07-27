import '../../../contact/entities/contact.dart';
import '../../../contact/models/contact_id.dart';
import '../../../contact/models/contact_status.dart';
import '../../../contact/models/contact_type.dart';
import '../../../profiles/entities/profile.dart';
import '../mock/mock_contacts_data.dart';
import 'contact_management_repository.dart';

/// In-memory `ContactManagementRepository` backed by fixed mock data.
/// No backend, no persistence, no network — see the feature README.
/// Keeps its own mutable copy of [mockContacts] (same pattern as
/// `MockAddressManagementRepository`) so create/update/delete actually
/// change what [getContacts] returns afterwards.
class MockContactManagementRepository implements ContactManagementRepository {
  final List<Contact> _contacts = List.of(mockContacts);

  @override
  Future<Profile> getProfile() => Future.value(mockContactsProfile);

  @override
  Future<List<Contact>> getContacts() =>
      Future.value(List.unmodifiable(_contacts));

  @override
  Future<Contact> createContact({
    required ContactType type,
    required String value,
  }) async {
    final contact = Contact(
      id: ContactId.create(),
      identityId: mockContactsProfile.identityId,
      type: type,
      value: value,
      status: ContactStatus.active,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
    _contacts.add(contact);
    return contact;
  }

  @override
  Future<Contact> updateContact(Contact contact, {required String value}) async {
    final updated = contact.copyWith(value: value);
    final index = _contacts.indexWhere((c) => c.id == contact.id);
    if (index != -1) _contacts[index] = updated;
    return updated;
  }

  @override
  Future<void> deleteContact(Contact contact) async {
    _contacts.removeWhere((c) => c.id == contact.id);
  }
}
