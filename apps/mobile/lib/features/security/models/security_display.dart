import '../../../authentication/entities/authentication.dart';
import '../../../authentication/models/authentication_status.dart';
import '../../../credentials/entities/credential.dart';
import '../../../credentials/models/credential_status.dart';
import '../../../identity/entities/identity.dart';

/// Presentation-only composition of everything the Security screen
/// needs. Composes three real domain entities — [identity],
/// [authMethods], [credentials] — with **no simulated field at all**,
/// the same intentional deviation already documented for
/// `ScheduleDisplay`/`ContactManagementDisplay`: everything the screen
/// shows (per-status counts, each record's type/status) is directly
/// derivable from the real lists, so nothing needed to be fabricated.
/// See the feature README.
///
/// [credentials] was added in a later prompt as a **planned
/// extension** of this same feature (already anticipated in this
/// feature's own README) rather than as a brand-new feature:
/// `Credential` only references `IdentityId` — never `Authentication`
/// — per the domain's own rule, so the two lists are shown side by
/// side, not merged or cross-referenced.
///
/// Nothing here is added to the domain entities themselves. No `Color`
/// or `IconData` is stored anywhere in this model — every widget
/// resolves both purely from `context.colors.*`/`Icons.*` at build
/// time.
class SecurityDisplay {
  const SecurityDisplay({
    required this.identity,
    required this.authMethods,
    required this.credentials,
  });

  final Identity identity;
  final List<Authentication> authMethods;
  final List<Credential> credentials;

  /// Derived from the real [authMethods] — see the class doc.
  int get activeCount =>
      authMethods.where((a) => a.status == AuthenticationStatus.active).length;

  /// Derived from the real [authMethods] — see the class doc.
  int get inactiveCount => authMethods
      .where((a) => a.status == AuthenticationStatus.inactive)
      .length;

  /// Derived from the real [authMethods] — see the class doc.
  int get lockedCount =>
      authMethods.where((a) => a.status == AuthenticationStatus.locked).length;

  /// Derived from the real [authMethods] — see the class doc.
  int get revokedCount =>
      authMethods.where((a) => a.status == AuthenticationStatus.revoked).length;

  /// Derived from the real [credentials] — see the class doc.
  int get activeCredentialsCount =>
      credentials.where((c) => c.status == CredentialStatus.active).length;

  /// Derived from the real [credentials] — see the class doc.
  int get expiredCredentialsCount =>
      credentials.where((c) => c.status == CredentialStatus.expired).length;

  /// Derived from the real [credentials] — see the class doc.
  int get revokedCredentialsCount =>
      credentials.where((c) => c.status == CredentialStatus.revoked).length;
}
