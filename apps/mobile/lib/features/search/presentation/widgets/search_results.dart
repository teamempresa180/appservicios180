import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/search_result.dart';
import 'search_result_card.dart';

/// Vertical list of `SearchResultCard`s, entering with a staggered
/// fade+slide (see `staggerDelayFor`). Purely visual — see the feature
/// README.
class SearchResults extends StatelessWidget {
  const SearchResults({super.key, required this.results});

  final List<SearchResult> results;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        for (final (index, result) in results.indexed) ...[
          FadeIn(
            delay: staggerDelayFor(index),
            child: SlideIn(child: SearchResultCard(result: result)),
          ),
          const SizedBox(height: AppSpacing.space12),
        ],
      ],
    );
  }
}
