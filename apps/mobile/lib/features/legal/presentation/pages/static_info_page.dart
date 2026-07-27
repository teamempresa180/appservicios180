import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';

/// Generic scrollable title+body page for static, non-interactive
/// content (Terms, Privacy, Help, About) — one reusable shell instead
/// of four near-identical screens. Content is placeholder copy until
/// the business supplies the real legal text.
class StaticInfoPage extends StatelessWidget {
  const StaticInfoPage({super.key, required this.title, required this.body});

  final String title;
  final String body;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.space20),
          child: Text(body, style: context.textStyles.bodyMedium),
        ),
      ),
    );
  }
}
