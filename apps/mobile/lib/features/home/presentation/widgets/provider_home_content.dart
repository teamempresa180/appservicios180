import 'package:flutter/material.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../mock/mock_home_data.dart';
import 'home_map_background.dart';
import 'provider_summary.dart';

/// Proveedor-specific Home content: a small "my location" map card (see
/// `HomeMapBackground` — same "flechita"/my-location dot as Cliente
/// Home, just laid out as a fixed-height card here instead of a
/// full-bleed background, since Proveedor Home doesn't use the
/// Uber-style floating panel) followed by the quick stats summary. The
/// stats are still mock (see [MockHomeData]) — no backend, no real
/// orders/ratings yet.
class ProviderHomeContent extends StatelessWidget {
  const ProviderHomeContent({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SlideIn(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(AppSpacing.space16),
            child: SizedBox(
              height: 180,
              child: HomeMapBackground(isDark: isDark),
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.space16),
        SlideIn(
          child: ProviderSummary(
            pendingOrders: MockHomeData.pendingOrders,
            publishedServices: MockHomeData.publishedServices,
            rating: MockHomeData.rating,
            isAvailable: MockHomeData.isAvailable,
          ),
        ),
      ],
    );
  }
}
