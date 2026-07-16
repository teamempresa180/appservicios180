import '../../session/session_manager.dart';
import '../routes/app_routes.dart';

/// Routes reachable while logged out. Anything else is treated as
/// protected and requires an authenticated [SessionManager].
const _publicRoutes = {
  AppRoutes.splash,
  AppRoutes.onboarding,
  AppRoutes.login,
  AppRoutes.register,
  AppRoutes.selectRole,
};

/// Of the public routes, these are only meaningful while logged out
/// (the sign-in/sign-up flow) — an authenticated user landing on one
/// of these is bounced to Home. Onboarding is left out on purpose:
/// it's a harmless intro screen, not an auth gate, so revisiting it
/// while logged in isn't redirected.
const _preAuthOnlyRoutes = {AppRoutes.login, AppRoutes.register, AppRoutes.selectRole};

/// Consults [SessionManager] to keep unauthenticated users out of
/// protected routes (redirecting to Login) and authenticated users out
/// of the sign-in/sign-up routes (redirecting to Home).
///
/// Splash is always left alone — it owns its own session check
/// (`SessionManager.restore()`) and picks its own first destination;
/// this guard only reacts to what's already resolved. It also stays
/// out of the way while [SessionManager.isRestoring] is true, so it
/// never races Splash's own `context.go`.
class AppRouteGuard {
  const AppRouteGuard(this._sessionManager);

  final SessionManager _sessionManager;

  /// Returns the path to redirect to, or `null` to allow navigation to
  /// [location] as requested.
  String? redirect(String location) {
    if (location == AppRoutes.splash) return null;
    if (_sessionManager.isRestoring) return null;

    final isAuthenticated = _sessionManager.isAuthenticated;

    if (!isAuthenticated && !_publicRoutes.contains(location)) {
      return AppRoutes.login;
    }
    if (isAuthenticated && _preAuthOnlyRoutes.contains(location)) {
      return AppRoutes.home;
    }
    return null;
  }
}
