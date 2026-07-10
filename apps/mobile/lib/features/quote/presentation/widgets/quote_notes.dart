import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/quote_data.dart';

/// Observations left by the provider on the quote. Real domain data
/// (`Quote.notes`) — see `QuoteData` and the feature README.
class QuoteNotes extends StatelessWidget {
  const QuoteNotes({super.key, required this.data});

  final QuoteData data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Observaciones'),
          Text(data.notes, style: context.textStyles.bodyMedium),
        ],
      ),
    );
  }
}
