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
  Future<Profile> getProfile() => Future.value(mockProfile);

  @override
  Future<Identity> getIdentity() => Future.value(mockIdentity);

  @override
  Future<List<Contact>> getContacts() =>
      Future.value(List.unmodifiable(mockContacts));

  @override
  Future<Address> getAddress() => Future.value(mockProfileAddress);
}
