import 'package:flutter/material.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../mock/mock_home_data.dart';
import 'provider_summary.dart';

/// Proveedor-specific Home content: a quick stats summary. All data is
/// mock (see [MockHomeData]) — no backend, no real orders/ratings yet.
class ProviderHomeContent extends StatelessWidget {
  const ProviderHomeContent({super.key});

  @override
  Widget build(BuildContext context) {
    return SlideIn(
      child: ProviderSummary(
        pendingOrders: MockHomeData.pendingOrders,
        publishedServices: MockHomeData.publishedServices,
        rating: MockHomeData.rating,
        isAvailable: MockHomeData.isAvailable,
      ),
    );
  }
}
