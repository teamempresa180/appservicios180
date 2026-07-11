import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/widgets/app_icon_row.dart';

/// A single row for a simulated trust factor. Generic (only receives a
/// [label]) — reusable in any future screen that needs the same
/// icon+label row format, same spirit as `VerificationStepCard`.
class TrustFactorCard extends StatelessWidget {
  const TrustFactorCard({super.key, required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return AppIconRow(
      icon: AppIcons.success,
      iconColor: context.colors.primary,
      title: label,
    );
  }
}
