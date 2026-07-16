import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/navigation/routes/app_routes.dart';
import '../../../../core/session/session_manager.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_scaffold.dart';
import '../widgets/app_name_text.dart';

/// First screen shown on launch. Calls [SessionManager.restore] to
/// check for a persisted session against the real backend, then
/// navigates to Home if it's still valid, or Onboarding otherwise
/// (the previous unconditional "always go to Onboarding" behavior,
/// now the fallback for the logged-out case).
class SplashPage extends StatefulWidget {
  const SplashPage({super.key, SessionManager? sessionManager})
    : _sessionManager = sessionManager;

  /// Overridable for tests only — production call sites always resolve
  /// the real session manager from the service locator.
  final SessionManager? _sessionManager;

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  @override
  void initState() {
    super.initState();
    _restoreSession();
  }

  Future<void> _restoreSession() async {
    final sessionManager = widget._sessionManager ?? locator<SessionManager>();
    await sessionManager.restore();
    if (!mounted) return;
    context.go(
      sessionManager.isAuthenticated ? AppRoutes.home : AppRoutes.onboarding,
    );
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const AppNameText(),
            const SizedBox(height: AppSpacing.space24),
            const AppLoading(message: 'Inicializando...'),
          ],
        ),
      ),
    );
  }
}
