import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/verification_display.dart';

/// Verification title + subtitle (display name). Reuses
/// `AppSectionTitle`'s subtitle support — no new Core UI widget.
class VerificationHeader extends StatelessWidget {
  const VerificationHeader({super.key, required this.data});

  final VerificationDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppSectionTitle(
      title: 'Verificación de identidad',
      subtitle: data.displayName,
    );
  }
}
