import 'package:flutter/material.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../models/user_role.dart';
import 'home_floating_panel.dart';
import 'home_map_background.dart';
import 'home_map_greeting_pill.dart';

/// Cliente-specific Home content: a full-bleed map with a static
/// (non-draggable) floating panel on top — the Uber/inDrive-style
/// layout — instead of the previous scrolling card list. All data is
/// still mock (see [MockHomeData]) — no backend, no real search or
/// ordering, and no live "my location" tracking yet.
class ClientHomeContent extends StatelessWidget {
  const ClientHomeContent({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox.expand(
      child: ClipRRect(
        borderRadius: BorderRadius.circular(AppSpacing.space16),
        child: Stack(
          fit: StackFit.expand,
          children: [
            const HomeMapBackground(),
            Positioned(
              top: AppSpacing.space16,
              left: AppSpacing.space16,
              child: FadeIn(
                child: const HomeMapGreetingPill(role: UserRole.client),
              ),
            ),
            Align(
              alignment: Alignment.bottomCenter,
              child: SlideIn(
                child: const HomeFloatingPanel(role: UserRole.client),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
