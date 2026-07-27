import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/session/user_role.dart';
import 'home_floating_panel.dart';
import 'home_map_background.dart';
import 'home_map_greeting_pill.dart';

/// Cliente-specific Home content: a full-bleed map with a static
/// (non-draggable) floating panel on top — the Uber/inDrive-style
/// layout — instead of the previous scrolling card list. The panel
/// slides out of view while the user is actively panning the map (so it
/// doesn't get in the way) and slides back in once the map settles. All
/// data is still mock (see [MockHomeData]) — no backend, no real search
/// or ordering, and no live "my location" tracking yet.
class ClientHomeContent extends StatefulWidget {
  const ClientHomeContent({super.key});

  @override
  State<ClientHomeContent> createState() => _ClientHomeContentState();
}

class _ClientHomeContentState extends State<ClientHomeContent> {
  bool _isPanelVisible = true;

  void _onMapMoveStarted() {
    if (!_isPanelVisible) return;
    setState(() => _isPanelVisible = false);
  }

  void _onMapIdle() {
    if (_isPanelVisible) return;
    setState(() => _isPanelVisible = true);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return SizedBox.expand(
      child: ClipRRect(
        borderRadius: BorderRadius.circular(AppSpacing.space16),
        child: Stack(
          fit: StackFit.expand,
          children: [
            HomeMapBackground(
              isDark: isDark,
              onCameraMoveStarted: _onMapMoveStarted,
              onCameraIdle: _onMapIdle,
            ),
            Positioned(
              top: AppSpacing.space16,
              left: AppSpacing.space16,
              child: FadeIn(
                child: const HomeMapGreetingPill(role: UserRole.client),
              ),
            ),
            Align(
              alignment: Alignment.bottomCenter,
              child: AnimatedSlide(
                duration: AppDurations.medium,
                curve: Curves.easeOutCubic,
                offset: _isPanelVisible ? Offset.zero : const Offset(0, 1),
                child: AnimatedOpacity(
                  duration: AppDurations.medium,
                  opacity: _isPanelVisible ? 1 : 0,
                  child: const HomeFloatingPanel(role: UserRole.client),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
