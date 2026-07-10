import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/settings_display.dart';

/// Settings title + subtitle (display name). Reuses `AppSectionTitle`'s
/// subtitle support — no new Core UI widget.
class SettingsHeader extends StatelessWidget {
  const SettingsHeader({super.key, required this.data});

  final SettingsDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppSectionTitle(title: 'Configuración', subtitle: data.displayName);
  }
}
