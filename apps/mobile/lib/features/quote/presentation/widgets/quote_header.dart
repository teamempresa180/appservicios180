import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/quote_data.dart';

/// Quote title + subtitle (service name). Reuses `AppSectionTitle`'s
/// subtitle support — no new Core UI widget.
class QuoteHeader extends StatelessWidget {
  const QuoteHeader({super.key, required this.data});

  final QuoteData data;

  @override
  Widget build(BuildContext context) {
    return AppSectionTitle(
      title: 'Cotización',
      subtitle: data.service.name,
    );
  }
}
