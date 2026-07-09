import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/provider/models/provider_id.dart';
import 'package:mobile/provider/models/provider_status.dart';
import 'package:mobile/provider/models/provider_type.dart';
import 'package:mobile/provider/models/provider_experience.dart';
import 'package:mobile/identity/models/identity_id.dart';
import 'package:mobile/profiles/models/profile_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = ProviderId.create();
    final identityId = IdentityId.create();
    final providerProfileId = ProfileId.create();
    final now = DateTime(2026, 1, 1);
    final provider = Provider(
      id: id,
      identityId: identityId,
      providerProfileId: providerProfileId,
      status: ProviderStatus.active,
      type: ProviderType.independent,
      experience: ProviderExperience.advanced,
      biography: 'Electricista con 10 años de experiencia',
      yearsOfExperience: 10,
      createdAt: now,
      updatedAt: now,
    );

    expect(provider.id, id);
    expect(provider.identityId, identityId);
    expect(provider.providerProfileId, providerProfileId);
    expect(provider.status, ProviderStatus.active);
    expect(provider.type, ProviderType.independent);
    expect(provider.experience, ProviderExperience.advanced);
    expect(provider.yearsOfExperience, 10);
  });

  test('is equal to another provider with the same id', () {
    final id = ProviderId.create();
    final identityId = IdentityId.create();
    final providerProfileId = ProfileId.create();
    final now = DateTime(2026, 1, 1);
    Provider build() => Provider(
      id: id,
      identityId: identityId,
      providerProfileId: providerProfileId,
      status: ProviderStatus.active,
      type: ProviderType.independent,
      experience: ProviderExperience.advanced,
      biography: 'Bio',
      yearsOfExperience: 5,
      createdAt: now,
      updatedAt: now,
    );

    expect(build(), equals(build()));
  });
}
