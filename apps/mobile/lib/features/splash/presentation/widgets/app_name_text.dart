import 'package:flutter/material.dart';

/// Plain text rendering of the app name. No logo, no imagery — a neutral
/// placeholder until official branding exists.
class AppNameText extends StatelessWidget {
  const AppNameText({super.key});

  @override
  Widget build(BuildContext context) {
    return Text(
      'AppServicios',
      style: Theme.of(
        context,
      ).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w600),
    );
  }
}
