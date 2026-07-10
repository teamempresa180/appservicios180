import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../settings/presentation/pages/settings_page.dart';
import '../../models/profile_display.dart';

/// Profile title + subtitle (display name). Reuses `AppSectionTitle`'s
/// subtitle support — no new Core UI widget. The trailing gear icon
/// opens the (visual-only, fixed mock) Settings screen — the only
/// change authorized in the Settings prompt.
class ProfileHeader extends StatelessWidget {
  const ProfileHeader({super.key, required this.data});

  final ProfileDisplay data;

  void _openSettings(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Configuración')),
          body: const SafeArea(child: SettingsPage()),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AppSectionTitle(
      title: 'Perfil',
      subtitle: data.displayName,
      trailing: IconButton(
        onPressed: () => _openSettings(context),
        icon: const Icon(Icons.settings_outlined),
        tooltip: 'Configuración',
      ),
    );
  }
}
