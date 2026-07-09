import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_scaffold.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Temporary placeholder — the real Onboarding flow is not built yet.
class OnboardingPage extends StatelessWidget {
  const OnboardingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppScaffold(
      title: 'Onboarding',
      body: Column(
        children: [
          AppSectionTitle(title: 'Onboarding'),
          AppCard(child: Center(child: Text('En construcción'))),
        ],
      ),
    );
  }
}
