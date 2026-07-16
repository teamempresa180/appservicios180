import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/features/verification/repositories/mock_verification_repository.dart';
import 'package:mobile/identity/entities/identity.dart';
import 'package:mobile/profiles/entities/profile.dart';

void main() {
  group('MockVerificationRepository', () {
    final repository = MockVerificationRepository();

    test('getIdentity returns a real Identity entity, not a map', () async {
      expect(await repository.getIdentity(), isA<Identity>());
    });

    test('getProfile returns a real Profile with a display name', () async {
      final profile = await repository.getProfile();
      expect(profile, isA<Profile>());
      expect(profile.displayName, isNotEmpty);
    });

    test('profile references the same identity returned', () async {
      expect(
        (await repository.getProfile()).identityId,
        equals((await repository.getIdentity()).id),
      );
    });

    test('is independent from every other feature mock data', () async {
      expect(
        (await repository.getIdentity()).id.value.startsWith('verification-'),
        isTrue,
      );
    });
  });
}
