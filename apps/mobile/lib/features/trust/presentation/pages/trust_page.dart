import 'package:flutter/material.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../mock/mock_trust_data.dart';
import '../../models/trust_display.dart';
import '../../repositories/mock_trust_repository.dart';
import '../widgets/trust_empty_state.dart';
import '../widgets/trust_factors.dart';
import '../widgets/trust_header.dart';
import '../widgets/trust_loading.dart';
import '../widgets/trust_score_card.dart';

/// The three purely-visual states this screen can render — same
/// fixed-`state` approach as every list/detail feature since `search`.
enum TrustViewState { loading, empty, information }

/// Trust screen. Does NOT build its own `Scaffold` — it is meant to
/// live within the existing navigation flow (opened from `Provider
/// Profile`). Completely independent: its own repository, its own mock
/// data. No real scoring/backend involved — see the feature README.
class TrustPage extends StatelessWidget {
  const TrustPage({super.key, this.state = TrustViewState.information});

  final TrustViewState state;

  TrustDisplay _buildData() {
    final repository = MockTrustRepository();

    return TrustDisplay(
      identity: repository.getIdentity(),
      trust: repository.getTrust(),
      factors: mockTrustFactors,
    );
  }

  Widget _buildBody() {
    switch (state) {
      case TrustViewState.loading:
        return const TrustLoading();
      case TrustViewState.empty:
        return const TrustEmptyState();
      case TrustViewState.information:
        final data = _buildData();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ScaleIn(child: TrustScoreCard(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: TrustFactors(data: data)),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(
      header: TrustHeader(data: _buildData()),
      body: _buildBody(),
    );
  }
}
