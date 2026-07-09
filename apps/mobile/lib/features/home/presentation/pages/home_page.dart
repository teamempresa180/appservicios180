import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_scaffold.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Temporary placeholder — the real Home flow is not built yet.
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppScaffold(
      title: 'Home',
      body: Column(
        children: [
          AppSectionTitle(title: 'Home'),
          AppCard(child: Center(child: Text('En construcción'))),
        ],
      ),
    );
  }
}
