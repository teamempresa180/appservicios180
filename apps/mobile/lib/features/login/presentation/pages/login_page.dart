import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_scaffold.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Temporary placeholder — the real Login flow is not built yet.
class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppScaffold(
      title: 'Login',
      body: Column(
        children: [
          AppSectionTitle(title: 'Login'),
          AppCard(child: Center(child: Text('En construcción'))),
        ],
      ),
    );
  }
}
