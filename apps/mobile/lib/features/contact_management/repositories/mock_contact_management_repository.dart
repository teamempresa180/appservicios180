import '../../../contact/entities/contact.dart';
import '../../../profiles/entities/profile.dart';
import '../mock/mock_contacts_data.dart';
import 'contact_management_repository.dart';

/// In-memory `ContactManagementRepository` backed by fixed mock data.
/// No backend, no persistence, no network — see the feature README.
class MockContactManagementRepository implements ContactManagementRepository {
  @override
  Profile getProfile() => mockContactsProfile;

  @override
  List<Contact> getContacts() => List.unmodifiable(mockContacts);
}
