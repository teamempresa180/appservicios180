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
  Future<Profile> getProfile();
  Future<Identity> getIdentity();
  Future<List<Contact>> getContacts();
  Future<Address> getAddress();

  /// Updates the display name of the current account's [Profile] and
  /// returns the updated entity — backed by the real
  /// `PUT /profiles/:id` endpoint (see `HttpProfileRepository`).
  Future<Profile> updateDisplayName(String displayName);

  /// Updates the phone [Contact], creating it first if the account
  /// doesn't have one yet — backed by the real `PUT /contacts/:id` /
  /// `POST /contacts` endpoints (see `HttpProfileRepository`).
  Future<Contact> updatePhone(String value);

  /// Same as [updatePhone], for the email [Contact].
  Future<Contact> updateEmail(String value);

  /// Updates [Address.alias]/[Address.fullAddress] — the only two
  /// fields the real `PUT /addresses/:id` endpoint accepts (city/state/
  /// country/postalCode aren't updatable by backend design). Creates
  /// the address first if the account doesn't have one yet.
  Future<Address> updateAddress({required String alias, required String fullAddress});

  /// Uploads a new profile photo and returns the updated [Profile] with
  /// its `avatarUrl` set — backed by the real
  /// `POST /profiles/:id/avatar` endpoint (see `HttpProfileRepository`).
  Future<Profile> updateAvatar({
    required List<int> fileBytes,
    required String fileName,
    void Function(double progress)? onProgress,
  });
}
