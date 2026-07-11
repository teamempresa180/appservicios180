import 'package:flutter/material.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/widgets/app_empty_state.dart';

/// Visual-only empty state for the Search screen. Configurable so it
/// can represent both the initial "type something to search" state and
/// the "no results found" state — reuses `AppEmptyState`, no new Core
/// UI widget, no retry logic.
class SearchEmptyState extends StatelessWidget {
  const SearchEmptyState({
    super.key,
    required this.title,
    required this.description,
    this.icon = AppIcons.search,
  });

  final String title;
  final String description;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return AppEmptyState(title: title, description: description, icon: icon);
  }
}
