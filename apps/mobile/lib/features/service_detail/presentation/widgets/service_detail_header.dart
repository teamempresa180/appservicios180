import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/service_detail_data.dart';

/// Service Detail title (service name) + subtitle (category name).
/// Reuses `AppSectionTitle`'s subtitle support — no new Core UI widget.
class ServiceDetailHeader extends StatelessWidget {
  const ServiceDetailHeader({super.key, required this.data});

  final ServiceDetailData data;

  @override
  Widget build(BuildContext context) {
    return AppSectionTitle(
      title: data.service.name,
      subtitle: data.category.name,
    );
  }
}
