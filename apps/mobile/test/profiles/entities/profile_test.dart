import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/profiles/entities/profile.dart';
import 'package:mobile/profiles/models/profile_id.dart';
import 'package:mobile/profiles/models/profile_visibility.dart';
import 'package:mobile/profiles/models/profile_status.dart';
import 'package:mobile/identity/models/identity_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = ProfileId.create();
    final identityId = IdentityId.create();
    final now = DateTime(2026, 1, 1);
    final profile = Profile(
      id: id,
      identityId: identityId,
      displayName: 'Ana G.',
      avatarUrl: 'https://example.com/avatar.png',
      bio: 'Hola, soy Ana',
      visibility: ProfileVisibility.public,
      status: ProfileStatus.active,
      createdAt: now,
      updatedAt: now,
    );

    expect(profile.id, id);
    expect(profile.identityId, identityId);
    expect(profile.displayName, 'Ana G.');
    expect(profile.visibility, ProfileVisibility.public);
  });
}
