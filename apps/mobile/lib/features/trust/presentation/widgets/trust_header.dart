import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/trust_display.dart';

/// Trust title + subtitle (display name). Reuses `AppSectionTitle`'s
/// subtitle support — no new Core UI widget.
class TrustHeader extends StatelessWidget {
  const TrustHeader({super.key, required this.data});

  final TrustDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppSectionTitle(
      title: 'Confianza y reputación',
      subtitle: data.displayName,
    );
  }
}
