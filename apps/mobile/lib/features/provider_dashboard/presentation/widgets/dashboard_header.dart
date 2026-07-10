import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/provider_dashboard_display.dart';

/// Dashboard title + subtitle (provider name). Reuses
/// `AppSectionTitle`'s subtitle support — no new Core UI widget.
class DashboardHeader extends StatelessWidget {
  const DashboardHeader({super.key, required this.data});

  final ProviderDashboardDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppSectionTitle(
      title: 'Panel del proveedor',
      subtitle: data.providerName,
    );
  }
}
