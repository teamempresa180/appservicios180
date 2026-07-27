import 'package:flutter/material.dart';

/// Splash screen branding — the real 180° logo mark instead of the
/// former plain-text placeholder.
class AppNameText extends StatelessWidget {
  const AppNameText({super.key});

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      'assets/icon/app_icon_source.png',
      height: 96,
      filterQuality: FilterQuality.high,
    );
  }
}
