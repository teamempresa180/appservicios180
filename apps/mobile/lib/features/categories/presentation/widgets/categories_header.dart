import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Categories screen title + subtitle. Reuses `AppSectionTitle`'s
/// subtitle support — no new Core UI widget needed.
class CategoriesHeader extends StatelessWidget {
  const CategoriesHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppSectionTitle(
      title: 'Todas las categorías',
      subtitle: 'Explora todos los servicios disponibles.',
    );
  }
}
