import '../../core/base/entity.dart';
import '../../identity/models/identity_id.dart';
import '../models/profile_id.dart';
import '../models/profile_visibility.dart';
import '../models/profile_status.dart';

/// Represents the public/social profile of a person.
/// Pure data holder — no behavior, no persistence, no business rules.
class Profile extends Entity<ProfileId> {
  const Profile({
    required ProfileId id,
    required this.identityId,
    required this.displayName,
    required this.avatarUrl,
    required this.bio,
    required this.visibility,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  }) : super(id);

  final IdentityId identityId;
  final String displayName;
  final String? avatarUrl;
  final String? bio;
  final ProfileVisibility visibility;
  final ProfileStatus status;
  final DateTime createdAt;
  final DateTime updatedAt;
}
