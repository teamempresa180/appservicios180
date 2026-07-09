import 'package:go_router/go_router.dart';
import '../../../features/home/presentation/pages/home_page.dart';
import '../../../features/login/presentation/pages/login_page.dart';
import '../../../features/onboarding/presentation/pages/onboarding_page.dart';
import '../../../features/register/presentation/pages/register_page.dart';
import '../../../features/splash/presentation/pages/splash_page.dart';
import '../guards/app_route_guard.dart';
import '../routes/app_routes.dart';

/// Single source of truth for app navigation. Only structural routes exist
/// today — business routes will be added here as their features are built.
abstract final class AppRouter {
  static const AppRouteGuard _guard = AppRouteGuard();

  static final GoRouter router = GoRouter(
    initialLocation: AppRoutes.splash,
    redirect: (context, state) => _guard.redirect(state.matchedLocation),
    routes: [
      GoRoute(
        path: AppRoutes.splash,
        builder: (context, state) => const SplashPage(),
      ),
      GoRoute(
        path: AppRoutes.onboarding,
        builder: (context, state) => const OnboardingPage(),
      ),
      GoRoute(
        path: AppRoutes.login,
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: AppRoutes.register,
        builder: (context, state) => const RegisterPage(),
      ),
      GoRoute(
        path: AppRoutes.home,
        builder: (context, state) => const HomePage(),
      ),
    ],
  );
}
