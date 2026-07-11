import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_chip.dart';

/// The six purely-visual filters this screen can show. No real
/// filtering happens when one is selected — see the feature README
/// (same approach as `OrderStatusTabs` in `orders` and
/// `NotificationFilterTabs` in `notifications`).
enum ReviewFilter { all, fiveStars, fourStars, threeStars, twoStars, oneStar }

extension ReviewFilterLabel on ReviewFilter {
  String get label {
    switch (this) {
      case ReviewFilter.all:
        return 'Todas';
      case ReviewFilter.fiveStars:
        return '5★';
      case ReviewFilter.fourStars:
        return '4★';
      case ReviewFilter.threeStars:
        return '3★';
      case ReviewFilter.twoStars:
        return '2★';
      case ReviewFilter.oneStar:
        return '1★';
    }
  }
}

/// Filter selector for the Reviews screen. **Purely visual** —
/// selecting a filter only changes which one looks selected; it does
/// not filter `ReviewsList`.
class ReviewFilters extends StatefulWidget {
  const ReviewFilters({super.key, this.initialFilter = ReviewFilter.all});

  final ReviewFilter initialFilter;

  @override
  State<ReviewFilters> createState() => _ReviewFiltersState();
}

class _ReviewFiltersState extends State<ReviewFilters> {
  late ReviewFilter _selected;

  @override
  void initState() {
    super.initState();
    _selected = widget.initialFilter;
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          for (final filter in ReviewFilter.values) ...[
            AppChip(
              label: filter.label,
              selected: _selected == filter,
              onTap: () => setState(() => _selected = filter),
            ),
            const SizedBox(width: AppSpacing.space8),
          ],
        ],
      ),
    );
  }
}
