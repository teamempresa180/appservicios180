import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Search screen title + subtitle. Reuses `AppSectionTitle`'s subtitle
/// support — no new Core UI widget needed.
class SearchHeader extends StatelessWidget {
  const SearchHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppSectionTitle(
      title: 'Buscar servicios',
      subtitle: 'Encuentra exactamente lo que necesitas.',
    );
  }
}
