import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Marketplace title + subtitle. Reuses `AppSectionTitle`'s subtitle
/// support — no new Core UI widget needed.
class MarketplaceHeader extends StatelessWidget {
  const MarketplaceHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppSectionTitle(
      title: 'Explora servicios',
      subtitle: 'Encuentra el profesional ideal.',
    );
  }
}
