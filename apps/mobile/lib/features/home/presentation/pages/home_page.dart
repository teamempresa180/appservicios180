import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../mock/mock_user_role.dart';
import '../models/user_role.dart';
import '../widgets/client_home_content.dart';
import '../widgets/home_header.dart';
import '../widgets/provider_home_content.dart';

/// Single, role-adaptive Home screen. Lives inside the App Shell's body
/// (the "Inicio" destination) — it does NOT build its own `Scaffold`,
/// it only returns content for the area the Shell already provides.
///
/// The role is simulated locally via [MockUserRole] — there is no
/// authentication yet, so it cannot come from a real session. See the
/// feature README for how this will eventually connect to real data.
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    const role = MockUserRole.current;

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const FadeIn(child: HomeHeader(role: role)),
          const SizedBox(height: AppSpacing.space16),
          switch (role) {
            UserRole.client => const ClientHomeContent(),
            UserRole.provider => const ProviderHomeContent(),
          },
        ],
      ),
    );
  }
}
