import 'package:flutter/material.dart';
import '../../../../core/ui/animations/scale_in.dart';
import '../../../../core/ui/animations/slide_in.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_page_body.dart';
import '../../mock/mock_verification_data.dart';
import '../../models/verification_display.dart';
import '../../repositories/mock_verification_repository.dart';
import '../widgets/document_preview.dart';
import '../widgets/selfie_preview.dart';
import '../widgets/submit_verification_button.dart';
import '../widgets/verification_actions.dart';
import '../widgets/verification_empty_state.dart';
import '../widgets/verification_header.dart';
import '../widgets/verification_loading.dart';
import '../widgets/verification_status.dart';
import '../widgets/verification_steps.dart';

/// The three purely-visual states this screen can render — same
/// fixed-`state` approach as every list/detail feature since `search`.
enum VerificationViewState { loading, empty, information }

/// Verification screen. Does NOT build its own `Scaffold` — it is
/// meant to live within the existing navigation flow (opened from
/// `Provider Profile`). Completely independent: its own repository,
/// its own mock data. No real authentication/backend involved — see
/// the feature README.
class VerificationPage extends StatelessWidget {
  const VerificationPage({
    super.key,
    this.state = VerificationViewState.information,
  });

  final VerificationViewState state;

  VerificationDisplay _buildData() {
    final repository = MockVerificationRepository();

    return VerificationDisplay(
      identity: repository.getIdentity(),
      profile: repository.getProfile(),
      verificationStatus: mockVerificationStatus,
      completedSteps: mockVerificationCompletedSteps,
      pendingSteps: mockVerificationPendingSteps,
      rejectedReason: mockVerificationRejectedReason,
      estimatedReviewTime: mockVerificationEstimatedReviewTime,
    );
  }

  Widget _buildBody() {
    switch (state) {
      case VerificationViewState.loading:
        return const VerificationLoading();
      case VerificationViewState.empty:
        return const VerificationEmptyState();
      case VerificationViewState.information:
        final data = _buildData();
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            SlideIn(child: DocumentPreview(data: data)),
            const SizedBox(height: AppSpacing.space16),
            const SlideIn(child: SelfiePreview()),
            const SizedBox(height: AppSpacing.space16),
            ScaleIn(child: VerificationStatusCard(data: data)),
            const SizedBox(height: AppSpacing.space16),
            SlideIn(child: VerificationSteps(data: data)),
            const SizedBox(height: AppSpacing.space16),
            const VerificationActions(),
            const SizedBox(height: AppSpacing.space16),
            const SubmitVerificationButton(),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppPageBody(
      header: VerificationHeader(data: _buildData()),
      body: _buildBody(),
    );
  }
}
