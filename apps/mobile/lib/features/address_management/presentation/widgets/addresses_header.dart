import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Address Management title. No new Core UI widget — reuses
/// `AppSectionTitle`.
class AddressesHeader extends StatelessWidget {
  const AddressesHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppSectionTitle(
      title: 'Mis direcciones',
      subtitle: 'Administra las direcciones donde recibes servicios',
    );
  }
}
