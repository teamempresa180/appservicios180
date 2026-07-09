/// Extension point for future navigation guards (authentication, roles,
/// onboarding completion, etc.).
///
/// No such logic exists yet — [redirect] always allows navigation by
/// returning `null`. When real guards are needed, implement the checks
/// here and return the path to redirect to instead of `null`.
class AppRouteGuard {
  const AppRouteGuard();

  /// Returns the path to redirect to, or `null` to allow navigation to
  /// [location] as requested.
  String? redirect(String location) => null;
}
