import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/request_service_data.dart';

/// Request Service title + subtitle (service name). Reuses
/// `AppSectionTitle`'s subtitle support — no new Core UI widget.
class RequestServiceHeader extends StatelessWidget {
  const RequestServiceHeader({super.key, required this.data});

  final RequestServiceData data;

  @override
  Widget build(BuildContext context) {
    return AppSectionTitle(
      title: 'Solicitar servicio',
      subtitle: data.service?.name ?? data.category.name,
    );
  }
}
