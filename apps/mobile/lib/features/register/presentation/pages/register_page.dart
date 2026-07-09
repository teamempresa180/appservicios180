import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_scaffold.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Temporary placeholder — the real Register flow is not built yet.
class RegisterPage extends StatelessWidget {
  const RegisterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppScaffold(
      title: 'Register',
      body: Column(
        children: [
          AppSectionTitle(title: 'Register'),
          AppCard(child: Center(child: Text('En construcción'))),
        ],
      ),
    );
  }
}
