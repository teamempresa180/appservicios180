import '../../../authentication/entities/authentication.dart';
import '../../../authentication/models/authentication_status.dart';
import '../../../identity/entities/identity.dart';

/// Presentation-only composition of everything the Security screen
/// needs. Composes two real domain entities — [identity], [authMethods]
/// — with **no simulated field at all**, the same intentional
/// deviation already documented for `ScheduleDisplay`/
/// `ContactManagementDisplay`: everything the screen shows (per-status
/// counts, each method's type/status) is directly derivable from the
/// real `Authentication` list, so nothing needed to be fabricated. See
/// the feature README.
///
/// Nothing here is added to the domain entities themselves. No `Color`
/// or `IconData` is stored anywhere in this model — every widget
/// resolves both purely from `context.colors.*`/`Icons.*` at build
/// time.
class SecurityDisplay {
  const SecurityDisplay({required this.identity, required this.authMethods});

  final Identity identity;
  final List<Authentication> authMethods;

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
}
