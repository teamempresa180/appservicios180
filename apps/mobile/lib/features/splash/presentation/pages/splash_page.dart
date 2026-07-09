import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/navigation/routes/app_routes.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_loading.dart';
import '../../../../core/ui/widgets/app_scaffold.dart';
import '../widgets/app_name_text.dart';

/// First screen shown on launch. Waits briefly, then navigates to
/// onboarding automatically. Purely structural — no branding, no logic
/// beyond the timed navigation.
class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  static const Duration navigationDelay = Duration(seconds: 2);

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  @override
  void initState() {
    super.initState();
    Future.delayed(SplashPage.navigationDelay, () {
      if (!mounted) return;
      context.go(AppRoutes.onboarding);
    });
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
