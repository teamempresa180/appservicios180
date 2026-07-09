import '../../core/base/entity.dart';
import '../../identity/models/identity_id.dart';
import '../../profiles/models/profile_id.dart';
import '../models/provider_id.dart';
import '../models/provider_status.dart';
import '../models/provider_type.dart';
import '../models/provider_experience.dart';

/// Represents the professional profile of a person as a service provider.
/// Pure data holder — no categories, services, schedule, availability,
/// payments or location; no behavior, no persistence, no business rules.
class Provider extends Entity<ProviderId> {
  const Provider({
    required ProviderId id,
    required this.identityId,
    required this.providerProfileId,
    required this.status,
    required this.type,
    required this.experience,
    required this.biography,
    required this.yearsOfExperience,
    required this.createdAt,
    required this.updatedAt,
  }) : super(id);

  final IdentityId identityId;
  final ProfileId providerProfileId;
  final ProviderStatus status;
  final ProviderType type;
  final ProviderExperience experience;
  final String biography;
  final int yearsOfExperience;
  final DateTime createdAt;
  final DateTime updatedAt;
}
