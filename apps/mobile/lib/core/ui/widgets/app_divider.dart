import 'package:flutter/material.dart';
import '../tokens/app_spacing.dart';

/// Generic themed divider with consistent vertical spacing.
class AppDivider extends StatelessWidget {
  const AppDivider({super.key, this.verticalSpace = AppSpacing.space16});

  final double verticalSpace;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: verticalSpace),
      child: const Divider(height: 1),
    );
  }
}
