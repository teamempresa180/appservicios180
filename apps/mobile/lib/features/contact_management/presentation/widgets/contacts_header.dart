import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Contact Management title. No new Core UI widget — reuses
/// `AppSectionTitle`.
class ContactsHeader extends StatelessWidget {
  const ContactsHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppSectionTitle(
      title: 'Mis contactos',
      subtitle: 'Administra tus canales de contacto',
    );
  }
}
