import 'package:flutter/material.dart';
import '../animations/fade_in.dart';
import '../tokens/app_spacing.dart';

/// Root scroll skeleton shared by every list/detail page: an optional
/// fade-in [header], an optional [toolbar] (search bars, filter
/// tabs/chips placed between the header and the main content), and the
/// [body]. Extracted from the ~20 `*_page.dart` files that each
/// rebuilt `SingleChildScrollView(child: Column(crossAxisAlignment:
/// stretch, children: [header, gap, body]))` by hand.
///
/// Deliberately does **not** add a `SafeArea` — these pages are hosted
/// inside `AppShellPage`'s own `Scaffold`/`SafeArea`, so wrapping again
/// here would double it.
class AppPageBody extends StatelessWidget {
  const AppPageBody({
    super.key,
    this.header,
    this.toolbar = const [],
    required this.body,
  });

  final Widget? header;
  final List<Widget> toolbar;
  final Widget body;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (header != null) ...[
            FadeIn(child: header!),
            const SizedBox(height: AppSpacing.space16),
          ],
          for (final item in toolbar) ...[
            item,
            const SizedBox(height: AppSpacing.space16),
          ],
          body,
        ],
      ),
    );
  }
}
