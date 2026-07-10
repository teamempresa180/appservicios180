import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Provider Services title. No new Core UI widget — reuses
/// `AppSectionTitle`.
class ServicesHeader extends StatelessWidget {
  const ServicesHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppSectionTitle(
      title: 'Mis servicios',
      subtitle: 'Administra los servicios que ofreces',
    );
  }
}
