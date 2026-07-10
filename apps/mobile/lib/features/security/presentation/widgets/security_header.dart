import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/security_display.dart';

/// Security title + subtitle (display name). Reuses `AppSectionTitle`'s
/// subtitle support — no new Core UI widget.
class SecurityHeader extends StatelessWidget {
  const SecurityHeader({super.key, required this.data});

  final SecurityDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppSectionTitle(
      title: 'Seguridad',
      subtitle: data.identity.fullName,
    );
  }
}
