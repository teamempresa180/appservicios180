import '../../../address/entities/address.dart';
import '../../../contact/entities/contact.dart';
import '../../../identity/entities/identity.dart';
import '../../../profiles/entities/profile.dart';
import '../mock/mock_profile_data.dart';
import 'profile_repository.dart';

/// In-memory `ProfileRepository` backed by fixed mock data. No
/// backend, no persistence, no network — see the feature README.
class MockProfileRepository implements ProfileRepository {
  @override
  Profile getProfile() => mockProfile;

  @override
  Identity getIdentity() => mockIdentity;

  @override
  List<Contact> getContacts() => List.unmodifiable(mockContacts);

  @override
  Address getAddress() => mockProfileAddress;
}
