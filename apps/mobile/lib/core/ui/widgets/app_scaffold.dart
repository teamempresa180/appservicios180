import 'package:flutter/material.dart';
import '../tokens/app_spacing.dart';

/// Generic screen scaffold: consistent background, optional app bar and
/// content padding. No domain meaning — screens compose their own content.
class AppScaffold extends StatelessWidget {
  const AppScaffold({
    super.key,
    required this.body,
    this.title,
    this.actions,
    this.padding = const EdgeInsets.all(AppSpacing.space16),
    this.floatingActionButton,
  });

  final Widget body;
  final String? title;
  final List<Widget>? actions;
  final EdgeInsetsGeometry padding;
  final Widget? floatingActionButton;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: title == null
          ? null
          : AppBar(title: Text(title!), actions: actions),
      body: SafeArea(
        child: Padding(padding: padding, child: body),
      ),
      floatingActionButton: floatingActionButton,
    );
  }
}
