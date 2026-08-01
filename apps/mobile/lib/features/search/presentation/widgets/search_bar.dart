import 'package:flutter/material.dart';
import '../../../../core/ui/icons/app_icons.dart';
import '../../../../core/ui/widgets/app_text_field.dart';

/// Search input field. Reuses `AppTextField`'s `prefixIcon` support.
/// Typing is forwarded to [onChanged] (client-side filtering of the
/// already-loaded results — see `SearchViewModel.search`).
///
/// Named `SearchInputBar` (not `SearchBar`) to avoid colliding with
/// Flutter's own Material 3 `SearchBar` widget.
class SearchInputBar extends StatefulWidget {
  const SearchInputBar({super.key, this.onChanged});

  final ValueChanged<String>? onChanged;

  @override
  State<SearchInputBar> createState() => _SearchInputBarState();
}

class _SearchInputBarState extends State<SearchInputBar> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppTextField(
      controller: _controller,
      hint: 'Buscar servicios o profesionales',
      prefixIcon: AppIcons.search,
      onChanged: widget.onChanged ?? (_) {},
    );
  }
}
