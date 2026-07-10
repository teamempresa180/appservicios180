import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/trust_display.dart';
import 'trust_factor_card.dart';

/// Lists the simulated factors behind the current score
/// (`TrustDisplay.factors` — see the feature README) via
/// `TrustFactorCard`.
class TrustFactors extends StatelessWidget {
  const TrustFactors({super.key, required this.data});

  final TrustDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Factores considerados'),
          for (final factor in data.factors) TrustFactorCard(label: factor),
        ],
      ),
    );
  }
}
