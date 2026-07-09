import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/search_result.dart';
import 'search_result_card.dart';

/// Vertical list of `SearchResultCard`s. Purely visual — see the
/// feature README.
class SearchResults extends StatelessWidget {
  const SearchResults({super.key, required this.results});

  final List<SearchResult> results;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        for (final result in results) ...[
          SearchResultCard(result: result),
          const SizedBox(height: AppSpacing.space12),
        ],
      ],
    );
  }
}
